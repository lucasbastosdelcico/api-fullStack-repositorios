using CadastroRepositorio.Domain.Data.DTO;
using CadastroRepositorio.Domain.Data.Entities;

namespace CadastroRepositorio.Domain.Abstractions.IService
{
    public interface IRepositoriesService
    {
        Task<IEnumerable<Repositories>> GetAllAsync(RepositoriesParams rep);
        Task<IEnumerable<Repositories>> GetFavoritosAsync();
        Task<Repositories> GetByIdAsync(int id);
        Task<Repositories> AddAsync(Repositories repository);
        Task UpdateAsync(Repositories repository);
        Task<bool> DeleteAsync(int id);
        Task<bool> UpdateIsFavoritoAsync(int id, bool isFavorito);
    }
}
