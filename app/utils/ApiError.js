export const customError = (
    error,
    req,
    res,
    next,
  ) => {
  
    if (error.errorDescription) { 
      error.errorDescription = error.errorDescription.trim();
      if (error.message == 'Bad request.') {
        error.message = error.errorDescription.split(',')[0];
      }
    }
    if (error.message === 'invalid token' || error.message === 'jwt malformed' || error.name === 'JsonWebTokenError') {
      error.status = 401;
      error.message = 'Invalid token format. Please provide a valid JWT.';
    }
    if (error.name === 'TokenExpiredError') {
      error.status = 401;
      error.message = 'This token has been expired.';
    }
  
    const statusCode = error.statusCode || 500; 
  
    const response = {
      error: statusCode === 500 ? { description: error.message } : error,
      message: statusCode === 500 ? 'Something went wrong' : error.message,
      responseStatus: statusCode,
    };
  
    console.log("🚀 ~ response:", response);
  
    return res.status(statusCode).json(response);
  };
  

	
// 404 Not Found Error
export const notFound = (req, res, next) => {
	const error = new Error('Path not found.');
	error.status = 404;
	error.message = 'Path not found';
	// const error = new CustomError(404, `Path not found`);
	next(error);
};


class ApiError extends Error {

    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "",
    ) {
        console.log("🚀 ~ ApiError ~ message:", message)

        // whenever we want to overide the constructor we use super
        super(message)
        this.statusCode = statusCode
        console.log("🚀 ~ ApiError ~ statusCode:", statusCode)
        this.message = message
        this.data = null
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}