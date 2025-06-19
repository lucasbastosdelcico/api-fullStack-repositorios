using System;
using System.IO;
using Microsoft.Extensions.Logging;

namespace CadastroRepositorio.Infrastructure.Logging
{
    public class CustomerLogger : ILogger
    {
        private readonly string _loggerName;
        private readonly CustomLoggerProviderConfiguration _loggerConfig;

        public CustomerLogger(string name, CustomLoggerProviderConfiguration config)
        {
            _loggerName = name;
            _loggerConfig = config;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return logLevel >= _loggerConfig.LogLevel;
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            return null;
        }

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception exception,
            Func<TState, Exception, string> formatter)
        {
            if (!IsEnabled(logLevel)) return;

            string message = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} [{logLevel}] ({eventId.Id}) {_loggerName}: {formatter(state, exception)}";

            WriteLog(message);
        }

        private void WriteLog(string message)
        {
            string logFilePath = _loggerConfig.LogFilePath;

            try
            {
               
                string directory = Path.GetDirectoryName(logFilePath)!;
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

               
                using StreamWriter streamWriter = new StreamWriter(logFilePath, append: true);
                streamWriter.WriteLine(message);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
