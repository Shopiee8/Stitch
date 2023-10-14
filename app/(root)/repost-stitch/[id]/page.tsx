import RePostThread from "@/components/forms/Repostthread";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <>
      <h1 className="head-text">Reopost Stitch</h1>

      <RePostThread
        userId={userInfo._id}
        threadId={thread._id}
        threadText={thread.text}
        threadImage={thread.image}
        threadVideo={thread.video}
      />
    </>
  );
};

export default Page;
