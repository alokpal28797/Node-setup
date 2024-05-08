import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const registerUser = asyncHandler(async (req, res) => {

    // get user details
    // validations
    // check if user already exists
    // check for images, avatar
    // upload them to cloudinary, avatar
    // create user object -create entry in db
    // remove pwd and refresh token
    // check for user creation
    // return res

    const { fullName, email, userName, password } = req.body;
    console.log("🚀 ~ registerUser ~ fullName:", fullName)

    if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fileds are required")
    }

    const alreadyExists = await User.findOne({ $or: [{ userName }, { email }] });

    if (!alreadyExists) {
        throw new ApiError(409, "User Already exists");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;

    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar LocalPath is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const response = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    })

    response = {
        password: null,
        refreshToken: null,
    }

    return ApiResponse(201, response, "User registered successfully")
})