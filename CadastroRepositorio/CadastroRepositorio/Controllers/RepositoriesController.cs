using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CadastroRepositorio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepositoriesController : ControllerBase
    {
        [HttpGet]
        public Task<ActionResult> Get()
        {  
            return Task.FromResult<ActionResult>(Ok("List of repositories"));
        }
    }
}
