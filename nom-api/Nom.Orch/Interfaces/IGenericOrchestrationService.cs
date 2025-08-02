using System.Collections.Generic;
using System.Threading.Tasks;

namespace Nom.Orch.Interfaces
{
    /// <summary>
    /// Generic orchestration service interface providing common CRUD operations.
    /// Reduces code duplication across all orchestration services.
    /// </summary>
    /// <typeparam name="TModel">The response model type</typeparam>
    public interface IGenericOrchestrationService<TModel>
    {
        /// <summary>
        /// Retrieves all items of the specified type.
        /// </summary>
        /// <returns>A list of all items</returns>
        Task<List<TModel>> GetAllAsync();

        /// <summary>
        /// Retrieves an item by its ID.
        /// </summary>
        /// <param name="id">The ID of the item to retrieve</param>
        /// <returns>The item if found, null otherwise</returns>
        Task<TModel?> GetByIdAsync(long id);

        /// <summary>
        /// Creates a new item.
        /// </summary>
        /// <param name="model">The creation model</param>
        /// <returns>The created item</returns>
        Task<TModel> CreateAsync(object model);

        /// <summary>
        /// Updates an existing item.
        /// </summary>
        /// <param name="id">The ID of the item to update</param>
        /// <param name="model">The update model</param>
        /// <returns>The updated item if found, null otherwise</returns>
        Task<TModel?> UpdateAsync(long id, object model);

        /// <summary>
        /// Deletes an item by its ID.
        /// </summary>
        /// <param name="id">The ID of the item to delete</param>
        /// <returns>True if the item was deleted, false if not found</returns>
        Task<bool> DeleteAsync(long id);
    }
}