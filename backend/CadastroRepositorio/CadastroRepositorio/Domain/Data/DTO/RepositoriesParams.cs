using CadastroRepositorio.Domain.Data.Entities;

namespace CadastroRepositorio.Domain.Data.DTO
{
    public class RepositoriesParams
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? NomeRepositorio { get; set; }
        public string? NomeDonoRepositorio { get; set; }


    }
}
