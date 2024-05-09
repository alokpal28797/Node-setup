
// Default Response For Every Api
export const ApiResponse = (
	res,
	statusCode,
	message,
	data,
	total, 
	page,

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

	return res.status(statusCode).json(response);
};
