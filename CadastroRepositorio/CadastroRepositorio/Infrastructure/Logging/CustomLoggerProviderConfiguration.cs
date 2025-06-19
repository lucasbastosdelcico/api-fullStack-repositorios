using System.Globalization;

namespace CadastroRepositorio.Infrastructure.Logging
{
    public class CustomLoggerProviderConfiguration
    {
        public LogLevel LogLevel { get; set; } = LogLevel.Warning;
        public string LogFilePath { get; set; } =
            Path.Combine(Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, @"..\..\..\..")), "Log", "log.txt");
        public int EventId { get; set; } = 0;
    }
}
