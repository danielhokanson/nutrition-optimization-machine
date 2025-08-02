using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Nom.Api.Services
{
    /// <summary>
    /// Factory for creating standardized API responses.
    /// Provides consistent response formats across all controllers.
    /// </summary>
    public static class ResponseFactory
    {
        /// <summary>
        /// Creates a success response with data.
        /// </summary>
        /// <typeparam name="T">The type of data</typeparam>
        /// <param name="data">The data to include in the response</param>
        /// <returns>A success response</returns>
        public static ActionResult<T> Success<T>(T data)
        {
            return new OkObjectResult(data);
        }

        /// <summary>
        /// Creates a success response with a message.
        /// </summary>
        /// <param name="message">The success message</param>
        /// <returns>A success response</returns>
        public static ActionResult Success(string message = "Operation completed successfully")
        {
            return new OkObjectResult(new { message });
        }

        /// <summary>
        /// Creates a created response with data and location.
        /// </summary>
        /// <typeparam name="T">The type of data</typeparam>
        /// <param name="data">The data to include in the response</param>
        /// <param name="actionName">The name of the action</param>
        /// <param name="routeValues">The route values</param>
        /// <returns>A created response</returns>
        public static ActionResult<T> Created<T>(T data, string actionName, object routeValues)
        {
            return new CreatedAtActionResult(actionName, null, routeValues, data);
        }

        /// <summary>
        /// Creates a bad request response with validation errors.
        /// </summary>
        /// <param name="errors">The validation errors</param>
        /// <returns>A bad request response</returns>
        public static ActionResult BadRequest(object errors)
        {
            return new BadRequestObjectResult(new
            {
                message = "Validation failed",
                errors
            });
        }

        /// <summary>
        /// Creates a not found response.
        /// </summary>
        /// <param name="message">The not found message</param>
        /// <returns>A not found response</returns>
        public static ActionResult NotFound(string message = "Resource not found")
        {
            return new NotFoundObjectResult(new { message });
        }

        /// <summary>
        /// Creates an unauthorized response.
        /// </summary>
        /// <param name="message">The unauthorized message</param>
        /// <returns>An unauthorized response</returns>
        public static ActionResult Unauthorized(string message = "Access denied")
        {
            return new UnauthorizedObjectResult(new { message });
        }

        /// <summary>
        /// Creates a conflict response.
        /// </summary>
        /// <param name="message">The conflict message</param>
        /// <returns>A conflict response</returns>
        public static ActionResult Conflict(string message = "Resource conflict")
        {
            return new ConflictObjectResult(new { message });
        }

        /// <summary>
        /// Creates an error response.
        /// </summary>
        /// <param name="message">The error message</param>
        /// <param name="error">The detailed error</param>
        /// <param name="statusCode">The HTTP status code</param>
        /// <returns>An error response</returns>
        public static ActionResult Error(string message, string error, int statusCode = 500)
        {
            return new ObjectResult(new
            {
                message,
                error,
                timestamp = DateTime.UtcNow
            })
            {
                StatusCode = statusCode
            };
        }

        /// <summary>
        /// Creates a no content response.
        /// </summary>
        /// <returns>A no content response</returns>
        public static ActionResult NoContent()
        {
            return new NoContentResult();
        }
    }
}