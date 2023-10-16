import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import CommunityAccountProfile from "@/components/forms/CommunityAccountProfile";

// Copy paste most of the code as it is from the /onboarding

async function Page({ params }: { params: { id: string } }) {
  const userInfo = await fetchCommunityDetails(params.id);

  const userData = {
    id: userInfo?.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : "",
    name: userInfo ? userInfo?.name : "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : "",
  };

  return (
    <>
      <h1 className="head-text">Edit Community</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12">
        <CommunityAccountProfile user={userData} btnTitle="Update" />
      </section>
    </>
  );
}

export default Page;
