// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import { MutualsSearchResponseType } from "../../types";
import { compareFollowersCount, formatTwitterUser } from "../../utils";

const client = new TwitterApi(process.env.TWITTER_API_KEY || "");

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
    return [];
  }

  const { id, profile_image_url = "" } = user.data;

  try {
    // Get followers
    const followers = await client.v2.followers(id, {
      "user.fields": "public_metrics,profile_image_url",
      max_results: 100,
    });

    // Get following
    const followed = await client.v2.following(id, {
      "user.fields": "public_metrics,profile_image_url",
      max_results: 100,
    });

    // Get mutuals
    const mutuals = followers.data.filter((follower) =>
      followed.data.some((followed) => followed.id === follower.id)
    );

    // Sort by followers count
    mutuals.sort(compareFollowersCount);

    const formattedMutuals = mutuals.map(formatTwitterUser);

    res.status(200).json({
      error: "",
      mutuals: formattedMutuals,
      userProfileImageUrl: profile_image_url,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get mutuals",
      mutuals: [],
      userProfileImageUrl: "",
    });
  }
};

export default getMutuals;
