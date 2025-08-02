using Microsoft.Extensions.Logging;
using Nom.Orch.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Nom.Orch.Services
{
    /// <summary>
    /// Generic orchestration service implementation providing common CRUD operations.
    /// This is a base class that specific services can inherit from or use as a reference.
    /// </summary>
    /// <typeparam name="TModel">The response model type</typeparam>
    public abstract class GenericOrchestrationService<TModel> : IGenericOrchestrationService<TModel>
    {
        protected readonly ILogger _logger;

        protected GenericOrchestrationService(ILogger logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all items of the specified type.
        /// Must be implemented by derived classes.
        /// </summary>
        /// <returns>A list of all items</returns>
        public abstract Task<List<TModel>> GetAllAsync();

        /// <summary>
        /// Retrieves an item by its ID.
        /// Must be implemented by derived classes.
        /// </summary>
        /// <param name="id">The ID of the item to retrieve</param>
        /// <returns>The item if found, null otherwise</returns>
        public abstract Task<TModel?> GetByIdAsync(long id);

        /// <summary>
        /// Creates a new item.
        /// Must be implemented by derived classes.
        /// </summary>
        /// <param name="model">The creation model</param>
        /// <returns>The created item</returns>
        public abstract Task<TModel> CreateAsync(object model);

        /// <summary>
        /// Updates an existing item.
        /// Must be implemented by derived classes.
        /// </summary>
        /// <param name="id">The ID of the item to update</param>
        /// <param name="model">The update model</param>
        /// <returns>The updated item if found, null otherwise</returns>
        public abstract Task<TModel?> UpdateAsync(long id, object model);

        /// <summary>
        /// Deletes an item by its ID.
        /// Must be implemented by derived classes.
        /// </summary>
        /// <param name="id">The ID of the item to delete</param>
        /// <returns>True if the item was deleted, false if not found</returns>
        public abstract Task<bool> DeleteAsync(long id);

        /// <summary>
        /// Logs an error with structured logging.
        /// </summary>
        /// <param name="ex">The exception to log</param>
        /// <param name="message">The message template</param>
        /// <param name="args">The message arguments</param>
        protected void LogError(Exception ex, string message, params object[] args)
        {
            _logger.LogError(ex, message, args);
        }

        /// <summary>
        /// Logs a warning with structured logging.
        /// </summary>
        /// <param name="message">The message template</param>
        /// <param name="args">The message arguments</param>
        protected void LogWarning(string message, params object[] args)
        {
            _logger.LogWarning(message, args);
        }

        /// <summary>
        /// Logs information with structured logging.
        /// </summary>
        /// <param name="message">The message template</param>
        /// <param name="args">The message arguments</param>
        protected void LogInformation(string message, params object[] args)
        {
            _logger.LogInformation(message, args);
        }
    }
}