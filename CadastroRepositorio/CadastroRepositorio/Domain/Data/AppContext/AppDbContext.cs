using CadastroRepositorio.Domain.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CadastroRepositorio.Domain.Data.AppContext
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Repositories> Repositories { get; set; }
    }
}
