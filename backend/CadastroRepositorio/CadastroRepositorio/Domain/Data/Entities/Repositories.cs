using System.ComponentModel.DataAnnotations;

namespace CadastroRepositorio.Domain.Data.Entities
{
    public class Repositories : Generics.EntityBase
    {
        [Required(ErrorMessage = "The repository name is required.")]
        public string NomeRepositorio { get; set; }

        [Required(ErrorMessage = "The description is required.")]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "The language is required.")]
        public string Linguagem { get; set; }

        [Required(ErrorMessage = "The repository owner name is required.")]
        public string NomeDonoRepositorio { get; set; }

        public bool IsFavorito { get; set; } = false;
    }
}
