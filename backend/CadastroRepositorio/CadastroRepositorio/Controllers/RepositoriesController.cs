
using CadastroRepositorio.Domain.Abstractions.IService;
using CadastroRepositorio.Domain.Data.DTO;
using CadastroRepositorio.Domain.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CadastroRepositorio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepositoriesController : ControllerBase
    {
        private readonly IRepositoriesService _repositoryService;
        public RepositoriesController(IRepositoriesService repositoryService)
        {
            _repositoryService = repositoryService ?? throw new ArgumentNullException(nameof(repositoryService));
        }
        [HttpGet]
        public async Task<IActionResult> GetAsync([FromQuery] RepositoriesParams rep)
        {
            var result = await _repositoryService.GetAllAsync(rep).ConfigureAwait(false);

            if (result.Item.Count() <= 0)
            {
                return NotFound("No repositories found.");
            }

            return Ok(result); 
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync([FromRoute] int id)
        {
            var repository = await _repositoryService.GetByIdAsync(id).ConfigureAwait(false);
            if (repository == null)
            {
                return NotFound($"Repository with id {id} not found.");
            }
            return Ok(repository);
        }
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] Repositories repository)
        {
            var post = await _repositoryService.AddAsync(repository).ConfigureAwait(false);
            return Ok(CreatedAtAction(nameof(GetByIdAsync), new { id = post.Id }, post));
        }

        [HttpPut]
        public async Task<IActionResult> PutAsync([FromBody] Repositories repository)
        {
            var existingRepository = await _repositoryService.GetByIdAsync(repository.Id).ConfigureAwait(false);
            if (existingRepository == null)
            {
                return NotFound($"Repository with id {repository.Id} not found.");
            }
            await _repositoryService.UpdateAsync(repository).ConfigureAwait(false);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
           var delete = await _repositoryService.GetByIdAsync(id).ConfigureAwait(false);
            if (delete == null)
            {
                return NotFound($"Repository with id {id} not found.");
            }
            await _repositoryService.DeleteAsync(id).ConfigureAwait(false);
            return NoContent();
        }
        [HttpGet("favoritos")]
        public async Task<IActionResult> GetFavoritosAsync()
        {
           var result = await _repositoryService.GetFavoritosAsync().ConfigureAwait(false);
            if (result == null || !result.Any())
            {
                return NotFound("No favorite repositories found.");
            }
            return Ok(result);
        }

        [HttpPut("favoritos/{id}/{isFavorito}")]
        public async Task<IActionResult> UpdateFavoritosAsync([FromRoute] int id , bool isFavorito)
        {
           var update = await _repositoryService.UpdateIsFavoritoAsync(id, isFavorito).ConfigureAwait(false);
            if (!update)
            {
                return NotFound($"Repository with id {id} not found.");
            }
            return NoContent();
        }
    }
}
