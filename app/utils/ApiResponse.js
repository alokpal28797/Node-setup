class ApiResponse {
    constructor(statusCode, data, message = "Success") {

        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;   // we have put this cond ass i we are sending something code has to be lower that 400, according to standard of status codes
    }
}

export default new ApiResponse()