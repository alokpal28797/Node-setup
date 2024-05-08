import { v2 as cloudinary } from "cloudinary";
import fs from "fs";



cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});


export const uploadOnCloudinary = async (loacalFilePath) => {
    try {
        if (!loacalFilePath) return null;

        const response = cloudinary.uploader.upload(loacalFilePath,
            { resource_type: "" });

        console.log("file is uploaded on cloudinary", response.url)
        return response;
    } catch (error) {
        console.log("🚀 ~ uploadOnCloudinary ~ error:", error)
        fs.unlinkSync(loacalFilePath)  // remove locally  saved temprary file as the upload operation got failed.
        return null;
    }
}

