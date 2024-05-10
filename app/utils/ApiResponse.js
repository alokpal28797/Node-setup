export const ApiResponse = (
	res,
	statusCode,
	message,
	data,
	accessToken,
	refreshToken,
	options,
	clearCookie,
	total,
	page
) => {
	let response = {
		statusCode: statusCode,
		message: message,
		data: data,
	};
	if (total) {
		response = { ...response, total };
	}
	if (page) {
		response = { ...response, page };
	}

	// Set cookies if accessToken and refreshToken are provided
	if (accessToken && refreshToken && options) {
		res.cookie("accessToken", accessToken, options).cookie(
			"refreshToken",
			refreshToken,
			options
		);
	}

	//  to clear cookies
	console.log("🚀 ~ clearCookie:", clearCookie)
	if (clearCookie === true){
		res.clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
	}

	return res.status(statusCode).json(response);
};
