using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace Nom.Api.Middleware
{
    /// <summary>
    /// Global exception handler middleware that provides centralized error handling.
    /// Catches all unhandled exceptions and returns standardized error responses.
    /// </summary>
    public class GlobalExceptionHandler
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            _logger.LogError(exception, "An unhandled exception occurred");

            context.Response.ContentType = "application/json";

            var (statusCode, message) = GetStatusCodeAndMessage(exception);

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                message = message,
                error = exception.Message,
                timestamp = DateTime.UtcNow,
                path = context.Request.Path,
                method = context.Request.Method
            };

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(jsonResponse);
        }

        private (HttpStatusCode statusCode, string message) GetStatusCodeAndMessage(Exception exception)
        {
            return exception switch
            {
                ArgumentException => (HttpStatusCode.BadRequest, "Invalid request parameters"),
                UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "Access denied"),
                InvalidOperationException => (HttpStatusCode.BadRequest, "Invalid operation"),
                KeyNotFoundException => (HttpStatusCode.NotFound, "Resource not found"),
                _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred")
            };
        }
    }

    /// <summary>
    /// Extension method to register the global exception handler middleware.
    /// </summary>
    public static class GlobalExceptionHandlerExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
        {
            return app.UseMiddleware<GlobalExceptionHandler>();
        }
    }
}