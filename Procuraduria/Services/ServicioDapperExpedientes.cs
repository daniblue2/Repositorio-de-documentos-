using Dapper;
using ProcuraduriaAPI.Models;
using System.Data;

namespace ProcuraduriaAPI.Services
{
    public class ServicioDapperExpedientes : IServicioDapperExpedientes
    {
        private readonly Dbcontext _contextDB;

        public ServicioDapperExpedientes(Dbcontext contextDB)
        {
            _contextDB = contextDB;
        }

        public async Task<List<Expediente>> DameTodosLosExpedientes()
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var expedientes = await connection.QueryAsync<Expediente>(
                    "sp_GetExpedientes",
                    commandType: CommandType.StoredProcedure
                );
                return expedientes.ToList();
            }
        }

        public async Task<Expediente?> DameExpedientePorId(int id)
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var parameters = new { Id = id };
                return await connection.QueryFirstOrDefaultAsync<Expediente>(
                    "sp_GetExpedienteById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
            }
        }

        public async Task<List<Expediente>> BuscarExpedientes(string? numero, string? nombre, string? tipoCaso)
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var parameters = new { Numero = numero, Nombre = nombre, TipoCaso = tipoCaso };
                var expedientes = await connection.QueryAsync<Expediente>(
                    "sp_BuscarExpedientes",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
                return expedientes.ToList();
            }
        }

        public async Task<Expediente> CrearExpediente(Expediente nuevoExpediente)
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var parameters = new
                {
                    nuevoExpediente.NumeroExpediente,
                    nuevoExpediente.NombrePersona,
                    nuevoExpediente.TipoCaso,
                    nuevoExpediente.Descripcion
                };
                var id = await connection.QuerySingleAsync<int>(
                    "sp_InsertExpediente",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
                nuevoExpediente.Id = id;
                return nuevoExpediente;
            }
        }

        public async Task<Expediente> ActualizarExpediente(int id, Expediente expedienteActualizar)
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var parameters = new
                {
                    Id = id,
                    expedienteActualizar.NumeroExpediente,
                    expedienteActualizar.NombrePersona,
                    expedienteActualizar.TipoCaso,
                    expedienteActualizar.Descripcion
                };
                await connection.ExecuteAsync(
                    "sp_UpdateExpediente",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
                expedienteActualizar.Id = id;
                return expedienteActualizar;
            }
        }

        public async Task<Expediente?> EliminarExpediente(int id)
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var expediente = await DameExpedientePorId(id);
                if (expediente != null)
                {
                    var parameters = new { Id = id };
                    await connection.ExecuteAsync(
                        "sp_DeleteExpediente",
                        parameters,
                        commandType: CommandType.StoredProcedure
                    );
                }
                return expediente;
            }
        }

        public async Task<ResumenEstadisticas> ObtenerResumenEstadisticas()
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var resumen = await connection.QueryFirstOrDefaultAsync<ResumenEstadisticas>(
                    "sp_ObtenerResumenEstadisticas",
                    commandType: CommandType.StoredProcedure
                );
                return resumen ?? new ResumenEstadisticas();
            }
        }

        public async Task<List<EstadisticaPorMes>> ObtenerCasosPorMes(int año = 0)
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var parameters = new { Año = año == 0 ? (int?)null : año };
                var resultados = await connection.QueryAsync<EstadisticaPorMes>(
                    "sp_ObtenerCasosPorMes",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
                return resultados.ToList();
            }
        }

        public async Task<List<EstadisticaPorEdad>> ObtenerCasosPorRangoEdad()
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var resultados = await connection.QueryAsync<EstadisticaPorEdad>(
                    "sp_ObtenerCasosPorRangoEdad",
                    commandType: CommandType.StoredProcedure
                );
                return resultados.ToList();
            }
        }

        public async Task<List<EstadisticaPorGenero>> ObtenerCasosPorGenero()
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var resultados = await connection.QueryAsync<EstadisticaPorGenero>(
                    "sp_ObtenerCasosPorGenero",
                    commandType: CommandType.StoredProcedure
                );
                return resultados.ToList();
            }
        }

        public async Task<List<EstadisticaGrupoVulnerable>> ObtenerCasosPorGrupoVulnerable()
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var resultados = await connection.QueryAsync<EstadisticaGrupoVulnerable>(
                    "sp_ObtenerCasosPorGrupoVulnerable",
                    commandType: CommandType.StoredProcedure
                );
                return resultados.ToList();
            }
        }

        public async Task<EstadisticasPorMes> ObtenerCasosPorMesEspecifico(int mes, int año)
        {
            using (IDbConnection connection = _contextDB.CreateConnection())
            {
                var resultado = await connection.QueryFirstOrDefaultAsync<EstadisticasPorMes>(
                    "sp_ObtenerCasosPorMesEspecifico",
                    new { Mes = mes, Año = año },
                    commandType: CommandType.StoredProcedure
                );
                return resultado ?? new EstadisticasPorMes();
            }
        }
    }
}