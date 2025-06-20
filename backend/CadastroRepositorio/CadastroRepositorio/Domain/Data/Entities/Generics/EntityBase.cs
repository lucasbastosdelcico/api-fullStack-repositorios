namespace CadastroRepositorio.Domain.Data.Entities.Generics
{
    public class EntityBase
    {
        public int Id { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public DateTime ModificationDate { get; set; } = DateTime.Now;
    }
}
