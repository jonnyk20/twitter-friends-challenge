// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterApiRateLimitPlugin } from "@twitter-api-v2/plugin-rate-limit";

import { TwitterApi, UserV2 } from "twitter-api-v2";
import { MutualsSearchResponseType } from "../../types";
import { compareFollowersCount, formatTwitterUser } from "../../utils";

const rateLimitPlugin = new TwitterApiRateLimitPlugin();
const client = new TwitterApi(process.env.TWITTER_API_KEY || "", {
  plugins: [rateLimitPlugin],
});

const USER_FETCH_LIMIT = 1000;

const fetchFollowers = async (
  id: string,
  count: number = USER_FETCH_LIMIT
): Promise<UserV2[]> => {
  let followers: UserV2[] = [];

  const followersPaginator = await client.v2.followers(id, {
    "user.fields": "public_metrics,profile_image_url",
    max_results: 100,
    asPaginator: true,
  });

  await followersPaginator.fetchLast(count);

  followers = followers.concat(followersPaginator.users);

  return followers;
};

const fetchFollowing = async (
  id: string,
  count: number = USER_FETCH_LIMIT
): Promise<UserV2[]> => {
  let followers: UserV2[] = [];

  const followersPaginator = await client.v2.following(id, {
    "user.fields": "public_metrics,profile_image_url",
    max_results: 100,
    asPaginator: true,
  });

  await followersPaginator.fetchLast(count);

  followers = followers.concat(followersPaginator.users);

  return followers;
};

const getMutuals = async (
  req: NextApiRequest,
  res: NextApiResponse<MutualsSearchResponseType>
) => {
  const { userHandle } = req.body;
  // Get user by username
  const user = await client.v2.userByUsername(userHandle, {
    "user.fields": "profile_image_url",
  });

  if (!user) {
    return res.status(404).json({
      error: "User not found",
      mutuals: [],
      userProfileImageUrl: "",
    });
  }

  const { id, profile_image_url = "" } = user.data;

  try {
    // Get followers
    const followers = await fetchFollowers(id);

    // Get following
    const followed = await fetchFollowing(id);

    // Get mutuals
    const mutuals = followers.filter((follower) =>
      followed.some((followed) => followed.id === follower.id)
    );

    // Sort by followers count
    mutuals.sort(compareFollowersCount);

    const formattedMutuals = mutuals.map(formatTwitterUser);

    if (!formattedMutuals.length) {
      return res.status(200).json({
        error:
          "No mutuals found. We only query the first 1000 followers and 1000 followed, and could not find mutuals within those",
        mutuals: [],
        userProfileImageUrl: profile_image_url,
      });
    }

    res.status(200).json({
      error: "",
      mutuals: formattedMutuals,
      userProfileImageUrl: profile_image_url,
    });
  } catch (error) {
    console.error("Failed to get mutuals");
    console.error(error);
    res.status(500).json({
      error: "Failed to get mutuals",
      mutuals: [],
      userProfileImageUrl: "",
    });
  }
};

export default getMutuals;
