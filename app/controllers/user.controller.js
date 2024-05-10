import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const generateAccesstokenAndRefreshToken = async (userId) => {
    console.log("🚀 ~ generateAccesstokenAndRefreshToken ~ userId:", userId)
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(400, "User doesnot exists");
        }

        const accessToken = await user.generateAccesstoken()
        const refreshToken = await user.generateRefreshtoken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        console.log("🚀 ~ generateAccesstokenAndRefreshToken ~ error:", error)

    }
}



export const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, userName, password } = req.body;

    if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fileds are required")
    }

    const alreadyExists = await User.findOne({ $or: [{ userName }, { email }] });

    if (alreadyExists) {
        throw new ApiError(409, "User Already exists");
    }
    console.log("🚀 ~ registerUser ~  req.files:", req.files)

    const avatarLocalPath = req?.files?.avatar ? req?.files?.avatar[0]?.path : undefined;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    })

    const response = {
        _id: user._id,
        fullName: user.fullName,
        avatar: user.avatar,
        coverImage: user.coverImage,
        email: user.email,
        userName: user.userName,
    };

    return ApiResponse(res, 201, "User registered successfully", response)
})

export const loginUser = asyncHandler(async (req, res) => {


    const { email, userName, password } = req.body;

    if (!(userName || email)) {
        throw new ApiError(400, "User name or email is required")
    }

    const isUserExist = await User.findOne({ $or: [{ userName }, { email }] })
    console.log("🚀 ~ loginUser ~ isUserExist:", isUserExist)

    if (!isUserExist) {
        throw new ApiError(400, "User does not exist")
    }

    const isPAsswordValid = await isUserExist.isPasswordCorrect(password)
    console.log("🚀 ~ loginUser ~ isPAsswordValid:", isPAsswordValid)

    if (!isPAsswordValid) {
        throw new ApiError(400, "Invalid user credentials")
    }

    console.log("🚀 ~ loginUser ~ isUserExist._id:", isUserExist._id)
    const { accessToken, refreshToken } = await generateAccesstokenAndRefreshToken(isUserExist._id);
    console.log("🚀 ~ loginUser ~ refreshToken:", refreshToken)
    console.log("🚀 ~ loginUser ~ accessToken:", accessToken)

    const response = {
        _id: isUserExist._id,
        fullName: isUserExist.fullName,
        avatar: isUserExist.avatar,
        coverImage: isUserExist.coverImage,
        email: isUserExist.email,
        userName: isUserExist.userName,
    };

    const options = {
        httpOnly: true,
        secure: true
    }

    // return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({ status : 200, message: "User logged in successfully" });
    return ApiResponse(
        res,
        200,
        "User logged in successfully",
        response,
        accessToken,
        refreshToken,
        options
    );


})


export const logout = asyncHandler(async (req, res,) => {

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, { new: true })


    const options = {
        httpOnly: true,
        secure: true
    }
    // return res.status(200)
    //     .clearCookie("accessToken", options)
    //     .clearCookie("refreshToken", options)
    //     .json({ status: 200, message: "User logged out", success: true })

    return ApiResponse(
        res,
        200,
        "User logged out successfully",
        null,
        null,
        null,
        options,
        true // clear cookies
    );
})