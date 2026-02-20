// src/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// শুধু production-এ log করুন
if (process.env.NODE_ENV !== "production") {
  console.log("Cloudinary config loaded:");
  console.log("  cloud_name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log(
    "  api_key   :",
    process.env.CLOUDINARY_API_KEY?.slice(0, 4) + "...",
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function - buffer থেকে সরাসরি Cloudinary-তে upload করার জন্য
export const uploadToCloudinary = (fileBuffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(fileBuffer);
  });
};

// Helper function - multiple files upload করার জন্য
export const uploadMultipleToCloudinary = async (files, folder = "uploads") => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, folder),
  );
  return Promise.all(uploadPromises);
};

export default cloudinary;
