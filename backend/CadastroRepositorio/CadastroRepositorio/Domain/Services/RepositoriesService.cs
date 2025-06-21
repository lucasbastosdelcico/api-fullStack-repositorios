using CadastroRepositorio.Domain.Abstractions.IRepository;
using CadastroRepositorio.Domain.Abstractions.IService;
using CadastroRepositorio.Domain.Data.DTO;
using CadastroRepositorio.Domain.Data.DTO.Generics;
using CadastroRepositorio.Domain.Data.Entities;

namespace CadastroRepositorio.Domain.Services
{
    public class RepositoriesService : IRepositoriesService
    {
        private readonly IRepositoriesRepository _repositoriesRepository;

        public RepositoriesService(IRepositoriesRepository repositoriesRepository)
        {
            _repositoriesRepository = repositoriesRepository ?? throw new ArgumentNullException(nameof(repositoriesRepository));
        }

        public async Task<ReturnPages<Repositories>> GetAllAsync(RepositoriesParams rep)
        {
            return await _repositoriesRepository.GetAllAsync(rep).ConfigureAwait(false);
        }

        public async Task<IEnumerable<Repositories>> GetFavoritosAsync()
        {
            return await _repositoriesRepository.GetFavoritosAsync().ConfigureAwait(false);
        }
        public async Task<Repositories> GetByIdAsync(int id)
        {
            return await _repositoriesRepository.GetByIdAsync(id).ConfigureAwait(false);
        }
        public async Task<Repositories> AddAsync(Repositories repository)
        {
            if (repository == null)
            {
                throw new ArgumentNullException(nameof(repository));
            }
            return await _repositoriesRepository.AddAsync(repository);
        }
        public async Task UpdateAsync(Repositories repository)
        {
            if (repository == null)
            {
                throw new ArgumentNullException(nameof(repository));
            }
            await _repositoriesRepository.UpdateAsync(repository);
        }
        public async Task<bool> DeleteAsync(int id)
        {
           return  await _repositoriesRepository.DeleteAsync(id);
        }

        public async Task<bool> UpdateIsFavoritoAsync(int id, bool isFavorito)
        {
            var entity = await _repositoriesRepository.GetByIdAsync(id).ConfigureAwait(false);

            if (entity == null)
                return false;

            entity.IsFavorito = isFavorito;
            entity.ModificationDate = DateTime.UtcNow;
            await _repositoriesRepository.UpdateAsync(entity);
            return true;
        }
    }
}
