using CadastroRepositorio.Domain.Abstractions.IRepository;
using CadastroRepositorio.Domain.Abstractions.IService;
using CadastroRepositorio.Domain.Data.AppContext;
using CadastroRepositorio.Domain.Data.Repository;
using CadastroRepositorio.Domain.Services;
using CadastroRepositorio.Infrastructure.Logging;
using CadastroRepositorio.Infrastructure.Middleware.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase(builder.Configuration.GetConnectionString("CadastroRepositorioDb")));

builder.Logging.AddProvider(new CustomLoggerProvider(new CustomLoggerProviderConfiguration
{   
       LogLevel = LogLevel.Information,
       LogFilePath = Path.Combine(Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, @"..\..\..\..")), "Log", "log.txt")
}));

builder.Services.AddScoped<IRepositoriesRepository, RepositoriesRepository>();
builder.Services.AddScoped<IRepositoriesService, RepositoriesService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.ConfigureExceptionHandler();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
