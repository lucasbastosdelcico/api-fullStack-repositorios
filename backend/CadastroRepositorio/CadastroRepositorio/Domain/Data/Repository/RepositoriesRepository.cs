using CadastroRepositorio.Domain.Abstractions.IRepository;
using CadastroRepositorio.Domain.Data.AppContext;
using CadastroRepositorio.Domain.Data.DTO;
using CadastroRepositorio.Domain.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CadastroRepositorio.Domain.Data.Repository
{
    public class RepositoriesRepository : IRepositoriesRepository
    {
        private readonly AppDbContext _context;
        public RepositoriesRepository(AppDbContext context)
        {
            _context = context;

        }
        public async Task<IEnumerable<Repositories>> GetAllAsync(RepositoriesParams rep)
        {
            var query = _context.Repositories.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(rep.NomeRepositorio))
            {
                query = query.Where(r => r.NomeRepositorio.Contains(rep.NomeRepositorio));
            }

            if (!string.IsNullOrWhiteSpace(rep.NomeDonoRepositorio))
            {
                query = query.Where(r => r.NomeDonoRepositorio.Contains(rep.NomeDonoRepositorio));
            }

            return await query
                .Skip((rep.PageNumber - 1) * rep.PageSize)
                .Take(rep.PageSize)
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<IEnumerable<Repositories>> GetFavoritosAsync()
        {
            return await _context.Repositories
                .Where(r => r.IsFavorito)
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<Repositories> GetByIdAsync(int id)
        {
            return await _context.Repositories.FirstOrDefaultAsync(r => r.Id == id);
        }
        public async Task<Repositories> AddAsync(Repositories repository)
        {
            _context.Repositories.Add(repository);
            await _context.SaveChangesAsync();
            return repository;
        }

        public async Task UpdateAsync(Repositories repository)
        {
            var entity = _context.Repositories.FindAsync(repository.Id).Result;

            entity.NomeRepositorio = repository.NomeRepositorio;
            entity.Descricao = repository.Descricao;
            entity.Linguagem = repository.Linguagem;
            entity.NomeDonoRepositorio = repository.NomeDonoRepositorio;
            entity.IsFavorito = repository.IsFavorito;
            entity.ModificationDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var repo = await _context.Repositories.FindAsync(id);
            if (repo == null) return false;

            _context.Repositories.Remove(repo);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
