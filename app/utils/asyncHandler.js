
//  we are using the function as the argumnets, it can also be used as
//  export const asyncHandler = (fn) => {async () => {} };

export const asyncHandler = (fn) => async (req, res, next) => {
    try {

    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}