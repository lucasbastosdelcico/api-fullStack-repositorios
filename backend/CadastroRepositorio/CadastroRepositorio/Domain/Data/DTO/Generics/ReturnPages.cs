namespace CadastroRepositorio.Domain.Data.DTO.Generics
{
    public class ReturnPages<T>
    {
        public IEnumerable<T> Item { get; set; } = new List<T>();
        public int TotalCount { get; set; }
    }

}
