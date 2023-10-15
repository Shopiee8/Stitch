import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const getUser = async () => await currentUser();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  media: f({
    // Configure the accepted file types and limits for the "media" route
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    audio: { maxFileSize: "8MB", maxFileCount: 1 },
    video: { maxFileSize: "20MB", maxFileCount: 1 },
  })
    .middleware(async (req) => {
      // This code runs on your server before upload
      const user = await getUser();

      // Check user permissions or any custom conditions
      if (!user) {
        throw new Error("Unauthorized");
      }

      // You can add more metadata here based on your application's needs
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      // Access the URL of the uploaded file
      console.log("File URL:", file.url);

      // You can perform additional actions here, such as storing the file URL in a database
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
