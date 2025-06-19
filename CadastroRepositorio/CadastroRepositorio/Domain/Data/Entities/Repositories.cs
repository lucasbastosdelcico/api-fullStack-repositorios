namespace CadastroRepositorio.Domain.Data.Entities
{
    public class Repositories : Generics.EntityBase
    {

        public string? NomeRepositorio { get; set; }
        public string? Descricao { get; set; }
        public string? Linguagem { get; set; }
        public string? NomeDonoRepositorio { get; set; }

    }
}
