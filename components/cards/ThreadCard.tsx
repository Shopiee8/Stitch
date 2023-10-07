import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";
import EditThread from "../atoms/EditThread";
import ReactThread from "../atoms/ReactThread";
import ReactStarsRating from "../atoms/ReactStarsRating";
import { Tooltip } from "@mui/material";
import { getStarsReactionsState } from "@/lib/actions/thread.actions";
import CustomImageContainer from "../common/CustomImageContainer";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  reactions: {
    image: string;
    _id: string;
    id: string;
    name: string;
    username: string;
  }[];
  image: string;
  video: string;
  ratings: [];
  isComment?: boolean;
  reactState?: boolean;
  isEditable: boolean;
}

async function ThreadCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  reactions,
  isComment,
  reactState,
  image,
  video,
  ratings,
  isEditable,
}: Props) {
  let ratingsStars = ratings?.map((rating) => rating?.stars);
  let sumRatings = 0;

  for (let i = 0; i < ratingsStars?.length; i++) {
    sumRatings += ratingsStars[i];
  }

  let averageRatings =
    ratingsStars?.length > 0 ? sumRatings / ratingsStars?.length : 0;

  let ratedStars = await getStarsReactionsState({
    threadId: id,
    userId: currentUserId,
  });

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7 max-md:px-2 max-md:py-3"
      }`}
    >
      <div className="flex items-start justify-between ">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <img
                src={author.image}
                alt="Profile image"
                className=" h-11 w-11 cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <div className="flex justify-between items-center">
              <Link
                href={`/profile/${author.id}`}
                className="w-fit flex gap-2 items-center"
              >
                <h4 className="cursor-pointer text-base-semibold text-light-1">
                  {author.name}
                </h4>
              </Link>
              {ratings ? (
                <>
                  <div className="flex gap-2 items-bottom">
                    <Image
                      src="/assets/star-icon.svg"
                      alt="star"
                      width={14}
                      height={14}
                      className="cursor-pointer object-contain -mt-[0.15rem]"
                    />
                    <div className="flex gap-1 items-center">
                      <div className="text-small-semibold text-light-1">
                        {averageRatings}
                      </div>
                      <div className="text-small-semibold text-light-1 cursor-pointer">
                        {ratings.length > 0 ? `(${ratings.length})` : ""}
                      </div>
                    </div>
                  </div>
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

              {isEditable && (
                <>
                  <div className="flex flex-row gap-2">
                    <Tooltip title="Delete" placement="top">
                      <DeleteThread
                        threadId={JSON.stringify(id)}
                        currentUserId={currentUserId}
                        authorId={author.id}
                        parentId={parentId}
                        isComment={isComment}
                      />
                    </Tooltip>
                    <Tooltip title="Edit" placement="top">
                      <EditThread
                        threadId={JSON.stringify(id)}
                        currentUserId={currentUserId}
                        authorId={author.id}
                      />
                    </Tooltip>
                  </div>
                </>
              )}
            </div>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            {image && (
              <>
                <CustomImageContainer image={image} />
              </>
            )}

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5 items-center">
                <ReactThread
                  threadId={id}
                  currentUserId={currentUserId}
                  interactState={reactState}
                  parentId={parentId}
                  isComment={isComment}
                />
                <Link href={`/thread/${id}`}>
                  <Tooltip title="Comment" placement="top">
                    <Image
                      src="/assets/reply.svg"
                      alt="reply"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </Tooltip>
                </Link>
                <Tooltip title="Repost" placement="top">
                  <Image
                    src="/assets/repost.svg"
                    alt="repost"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Tooltip>
                {/* <Tooltip title="Share" placement="top">
                  <Image
                    src="/assets/share.svg"
                    alt="share"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Tooltip> */}
                <ReactStarsRating
                  threadId={id}
                  userId={currentUserId}
                  ratedStars={ratedStars}
                />
              </div>

              <div className="flex flex-row gap-2">
                {isComment && (
                  <>
                    {comments.length > 0 && (
                      <Link href={`/thread/${id}`}>
                        <p className="mt-1 text-subtle-medium text-gray-1">
                          {comments.length}{" "}
                          {comments.length > 1 ? "replies" : "reply"}
                        </p>
                      </Link>
                    )}

                    {comments.length > 0 && reactions.length > 0 && (
                      <p className="mt-1 text-subtle-medium text-gray-1">•</p>
                    )}

                    {reactions.length > 0 && (
                      <Link href={`/thread/reactions/${id}`}>
                        <p className="mt-1 text-subtle-medium text-gray-1">
                          {reactions.length}{" "}
                          {reactions.length > 1 ? "likes" : "like"}
                        </p>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2">
        {!isComment && (
          <>
            {comments.length > 0 && (
              <div className="ml-1 mt-3 flex items-center gap-2">
                {comments.slice(0, 2).map((comment, index) => (
                  <img
                    key={index}
                    src={comment.author.image}
                    alt={`user_${index}`}
                    className={`${
                      index !== 0 && "-ml-5"
                    } h-[24px] w-[24px] rounded-full object-cover`}
                  />
                ))}

                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length}{" "}
                    {comments.length > 1 ? "replies" : "reply"}
                  </p>
                </Link>
              </div>
            )}

            {/* {comments.length > 0 && reactions.length > 0 && (
              <div className="ml-1 mt-3 flex items-center">
                <p className="mt-1 text-subtle-medium text-gray-1">•</p>
              </div>
            )} */}

            {reactions.length > 0 && (
              <div className="ml-1 mt-3 flex items-center gap-2">
                {reactions.slice(0, 2).map((reaction, index) => (
                  <img
                    key={index}
                    src={reaction.image}
                    alt={`user_${index}`}
                    className={`${
                      index !== 0 && "-ml-5"
                    } rounded-full h-[24px] w-[24px]  object-cover`}
                  />
                ))}

                <Link href={`/thread/reactions/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {reactions.length} {reactions.length > 1 ? "likes" : "like"}
                  </p>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>

          <img
            src={community.image}
            alt={community.name}
            className="ml-1 rounded-full object-cover w-[16px] h-[16px]"
          />
        </Link>
      )}
    </article>
  );
}

export default ThreadCard;
