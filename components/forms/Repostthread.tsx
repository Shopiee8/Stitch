"use client";

import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { createThread, editThread } from "@/lib/actions/thread.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { Input } from "../ui/input";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert, Snackbar } from "@mui/material";
import CustomVideoPlayer from "../common/CustomVideoPlayer";
import CustomImageContainer from "../common/CustomImageContainer";
// import CustomVideoTrimmer from "../common/CustomVideoTrimmer.jsx";

interface Props {
  userId: string;
  threadText: string;
  threadId: string;
  threadImage: string;
  threadVideo: string;
}

function RePostThread({
  userId,
  threadText,
  threadImage,
  threadId,
  threadVideo,
}: Props) {
  const router = useRouter();
  const { organization } = useOrganization();

  const { startUpload } = useUploadThing("media");
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    threadImage ? threadImage : null
  );
  const [videoPreview, setVideoPreview] = useState<
    string | ArrayBuffer | null | Boolean
  >(threadVideo ? threadVideo : null);
  const [files, setFiles] = useState<File[]>([]);

  const [text, setText] = useState(threadText ? threadText : "");

  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState(false);

  const [fileType, setFileType] = useState<
    string | ArrayBuffer | null | Boolean
  >(null);

  const handleImage = async (e) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.type;
      console.log(fileType);
      if (fileType.includes("image/")) {
        setImagePreview(null);
        setFiles(Array.from(e.target.files));

        fileReader.onload = async (event) => {
          const imageDataUrl = event.target?.result;
          if (imageDataUrl) {
            setImagePreview(imageDataUrl);
            setFileType("image");
          }
        };

        fileReader.readAsDataURL(file);
      } else {
        let fileDuaration = file.duration;
        if (fileDuaration > 120) {
          alert("File duration is greater than 2 minutes.");
          return false;
        } else {
          setFiles(Array.from(e.target.files));

          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result;
            if (imageDataUrl) {
              setVideoPreview(imageDataUrl);
              setFileType("video");
            }
          };

          fileReader.readAsDataURL(file);
          setVideoPreview(true);
        }
      }
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (files.length > 0) {
        if (fileType == "image") {
          let imageToBeUpload = await startUpload(files);
          await createThread({
            text: text,
            author: userId,
            communityId: organization ? organization.id : null,
            path: router?.asPath,
            image: imageToBeUpload[0]?.fileUrl,
          });
          console.log("image upload", imageToBeUpload);
          router.push("/");
          setLoading(false);
          setNotification(true);
        } else {
          let videoToUpload = await startUpload(files);
          await createThread({
            text: text,
            author: userId,
            communityId: organization ? organization.id : null,
            path: router?.asPath,
            video: videoToUpload[0]?.fileUrl,
          });
          console.log("video upload", videoToUpload);
          router.push("/");
          setLoading(false);
          setNotification(true);
        }
      } else {
        await createThread({
          text: text,
          author: userId,
          communityId: organization ? organization.id : null,
          path: router?.asPath,
          image: threadImage,
          video: threadVideo,
        });
        console.log("stitch upload");

        router.push("/");
        setLoading(false);
        setNotification(true);
      }
    } catch (error) {
      // Handle createThread error here
      console.error("Error posting thread:", error);
      setLoading(false);
    }
  };

  return (
    <form className="mt-10 flex flex-col justify-start gap-10">
      <Snackbar
        open={notification}
        autoHideDuration={6000}
        onClose={() => setNotification(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Stitch published.
        </Alert>
      </Snackbar>
      <div className="flex w-full flex-col gap-3">
        <div className="text-base-semibold text-light-2">Content</div>
        <div className="no-focus border border-dark-4  bg-dark-3 text-light-1 h-100 w-100">
          <Textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-dark-2 resize-none no-focus"
          />
          <br />
          {imagePreview ? (
            <>
              <div className="relative h-100 w-100">
                <CustomImageContainer image={imagePreview} />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CircularProgress size={36} />
                  </div>
                )}
              </div>
            </>
          ) : (
            ""
          )}
          {/* {videoPreview ? <CustomVideoPlayer url={videoPreview} /> : ""} */}
          {videoPreview ? <CustomVideoPlayer url={videoPreview} /> : ""}
          <Input
            type="file"
            accept="image/*, video/*"
            placeholder="Add profile photo"
            className="account-form_image-input"
            onChange={(e) => handleImage(e)}
          />
        </div>
        <div />
      </div>

      <Button
        type="button"
        className="bg-primary-500 d-flex gap-2 items-center justify-center"
        onClick={onSubmit}
        disabled={!text || loading}
      >
        Repost Stitch
        {loading && <CircularProgress size={18} />}
      </Button>
    </form>
  );
}

export default RePostThread;
