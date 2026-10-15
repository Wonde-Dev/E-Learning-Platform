/**
 * ApiResponse — standard JSON response wrapper.
 * Usage: res.json(new ApiResponse(200, data, "Success message"));
 * Serializes to: { success, status, data, message }
 */
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.success = statusCode < 400;
    this.status = statusCode;
    this.data = data;
    this.message = message;
  }
}

export { ApiResponse };
