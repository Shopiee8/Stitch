import Link from "next/link";
import Image from "next/image";
import FollowUser from "../atoms/FollowUser";
import { getAllRatedUserByUserId } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
import { fetchUser, getUserAverageRatings } from "@/lib/actions/user.actions";
import { StarIcon } from "@/public/svg";
import { Tooltip } from "antd";

interface Props {
  accountId: string;
  userId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: string;
  isFollowing?: boolean;
}

async function ProfileHeader({
  accountId,
  userId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
  isFollowing,
}: Props) {
  const dbUser = await fetchUser(accountId)
  const averageStars = await getUserAverageRatings(dbUser._id);

  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <div>
              <h2 className="text-left text-heading3-bold text-light-1">
                {name}
              </h2>
            </div>
            <p className="text-base-medium text-gray-1">@{username}</p>
            <div className="flex gap-2 items-center">
                {averageStars ? (
                  <>
                    <Tooltip title="User Average Ratings" placement="top">
                        <div className="flex gap-2 items-bottom cursor-pointer">
                          <Image
                            src="/assets/star-icon.svg"
                            alt="star"
                            width={14}
                            height={14}
                            className="cursor-pointer object-contain -mt-[0.15rem]"
                          />
                          <div className="flex gap-1 items-center">
                            <div className="text-small-semibold text-light-1">
                              {averageStars}
                            </div>
                          </div>
                        </div>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2 items-center">
                      <div className=" text-small-semibold text-light-1">0</div>
                      <Image
                        src="/assets/star-icon.svg"
                        alt="star"
                        width={14}
                        height={14}
                        className="cursor-pointer object-contain -mt-[0.15rem]"
                      />
                    </div>
                  </>
                )}
              </div>
          </div>
        </div>
        {type !== "Community" && (
          <div className="flex flex-row gap-2">
            <>
              {accountId === authUserId ? (
                <Link href="/profile/edit">
                  <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
                    <Image
                      src="/assets/edit.svg"
                      alt="logout"
                      width={16}
                      height={16}
                    />

                    <p className="text-light-2 max-sm:hidden">Edit</p>
                  </div>
                </Link>
              ) : (
                <FollowUser
                  userId={accountId}
                  currentUserId={authUserId}
                  isFollowing={isFollowing}
                />
              )}
            </>
          </div>
        )}
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}

export default ProfileHeader;
