# Twitter Friends Challenge

A web app where people can test how well they know their Twitter friends.
As of this writing, it's being hosted at [TwitterFriendsChallenge.com](https://www.TwitterFriendsChallenge.com)
Feel free to DM me if you find bugs or have questions: [@jonnykalambay](https://www.twitter.com/jonnykalambay)

## Usage Overview

This app allows users to take a quiz based on the tweets of their Twitter mutuals.

It's used as follows:

1. Enter your twitter handle and it will search for and list several of your Twitter mutuals (people you follow who also follow you)
2. Choose 3 of those mutuals whose tweets you'd like to be tested on
3. Confirm your selection, and the app will generate a quiz based on the tweets of those 3 people
4. Do the quiz and then see how your score compares to that of others
5. Optional use the share button to invite others to beat your score

## Tech Overview

- This a Next.js app created with [create-next-app](https://nextjs.org/docs/api-reference/create-next-app)
- The Twitter API is interacted with using [twitter-api-v2](https://www.npmjs.com/package/twitter-api-v2)
- The quiz is generated using [Open AI](https://openai.com/api/)
- The scoreboard is managed using [Firebase](https://firebase.google.com)
- The events are tracked using Firebase and [Mixpanel](https://mixpanel.com) (Note: You don't need both. You don't even need any for the app to work. Feel free to disable/remove the code from `analytics.ts` if you don't need it.)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Shameless plug for a related project

If generating quizzes from online content is something you'd like to do more of, check out: [Roshi.ai](https://www.roshi.ai/activities).
