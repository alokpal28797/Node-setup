import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
    try {

        const token = req?.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1]
        console.log("🚀 ~ verifyJWT ~ token:", token)

        if (!token) throw new ApiError(401, "user is unauthorised")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")

        req.user = user;

        next()

    } catch (error) {
        console.log("🚀 ~ verifyJWT ~ error:", error)
        // next(error)
        // throw new ApiError(401, error?.message || 'Invalid access token')
        next(error)
    }
}