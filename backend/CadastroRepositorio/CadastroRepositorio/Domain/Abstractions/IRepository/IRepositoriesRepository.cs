using CadastroRepositorio.Domain.Data.DTO;
using CadastroRepositorio.Domain.Data.DTO.Generics;
using CadastroRepositorio.Domain.Data.Entities;
using System.Threading.Tasks;

namespace CadastroRepositorio.Domain.Abstractions.IRepository
{
    public interface IRepositoriesRepository
    {
        Task<ReturnPages<Repositories>> GetAllAsync(RepositoriesParams rep);
        Task<Repositories> GetByIdAsync(int id);
        Task<IEnumerable<Repositories>> GetFavoritosAsync();
        Task<Repositories> AddAsync(Repositories repository);
        Task UpdateAsync(Repositories repository);
        Task<bool> DeleteAsync(int id);
    }
}
