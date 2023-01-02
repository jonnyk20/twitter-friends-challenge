import Head from "next/head";
import TwitterChallenge from "../components/TwitterFriendsChallenge";
import AppWrapper from "../AppWrapper";

export default function Home() {
  return (
    <>
      <Head>
        <title>Twitter Friends Challenge</title>
        <meta name="description" content="Twitter Friends Challenge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppWrapper>
        <TwitterChallenge />
      </AppWrapper>
    </>
  );
}
