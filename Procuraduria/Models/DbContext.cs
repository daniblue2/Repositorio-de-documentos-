using Microsoft.Data.SqlClient;
using System.Data;

namespace ProcuraduriaAPI.Models
{
    public class Dbcontext
    {
        private readonly IConfiguration _configuration;

        public Dbcontext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Método para crear conexión con Dapper
        public IDbConnection CreateConnection()
        {
            string connectionString = _configuration.GetConnectionString("MiConexion");
            return new SqlConnection(connectionString);
        }
    }
}