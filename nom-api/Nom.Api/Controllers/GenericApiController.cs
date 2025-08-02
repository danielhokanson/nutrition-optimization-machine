using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Nom.Orch.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Nom.Api.Controllers
{
    /// <summary>
    /// Generic base controller providing common CRUD operations and error handling patterns.
    /// Reduces code duplication across all API controllers.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public abstract class GenericApiController<TModel, TCreateModel, TUpdateModel> : BaseApiController
    {
        protected readonly IGenericOrchestrationService<TModel> _service;
        protected readonly ILogger _logger;

        protected GenericApiController(IGenericOrchestrationService<TModel> service, ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public virtual async Task<ActionResult<List<TModel>>> GetAll()
        {
            try
            {
                var items = await _service.GetAllAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving {ModelType} items", typeof(TModel).Name);
                return StatusCode(500, new { message = $"Failed to retrieve {typeof(TModel).Name} items", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public virtual async Task<ActionResult<TModel>> GetById([Required] long id)
        {
            try
            {
                var item = await _service.GetByIdAsync(id);
                if (item == null)
                {
                    _logger.LogWarning("{ModelType} with ID {Id} not found", typeof(TModel).Name, id);
                    return NotFound(new { message = $"{typeof(TModel).Name} not found" });
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving {ModelType} with ID {Id}", typeof(TModel).Name, id);
                return StatusCode(500, new { message = $"Failed to retrieve {typeof(TModel).Name}", error = ex.Message });
            }
        }

        [HttpPost]
        public virtual async Task<ActionResult<TModel>> Create([FromBody] TCreateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _service.CreateAsync(model);
                return CreatedAtAction(nameof(GetById), new { id = GetIdFromResponse(response) }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating {ModelType}", typeof(TModel).Name);
                return StatusCode(500, new { message = $"Failed to create {typeof(TModel).Name}", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public virtual async Task<ActionResult<TModel>> Update([Required] long id, [FromBody] TUpdateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _service.UpdateAsync(id, model);
                if (response == null)
                {
                    _logger.LogWarning("{ModelType} with ID {Id} not found for update", typeof(TModel).Name, id);
                    return NotFound(new { message = $"{typeof(TModel).Name} not found" });
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating {ModelType} with ID {Id}", typeof(TModel).Name, id);
                return StatusCode(500, new { message = $"Failed to update {typeof(TModel).Name}", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public virtual async Task<ActionResult> Delete([Required] long id)
        {
            try
            {
                var success = await _service.DeleteAsync(id);
                if (!success)
                {
                    _logger.LogWarning("{ModelType} with ID {Id} not found for deletion", typeof(TModel).Name, id);
                    return NotFound(new { message = $"{typeof(TModel).Name} not found" });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting {ModelType} with ID {Id}", typeof(TModel).Name, id);
                return StatusCode(500, new { message = $"Failed to delete {typeof(TModel).Name}", error = ex.Message });
            }
        }

        /// <summary>
        /// Extracts the ID from the response object. Override in derived classes if needed.
        /// </summary>
        protected virtual long GetIdFromResponse(TModel response)
        {
            // Default implementation - override in derived classes if needed
            return 0;
        }
    }
}