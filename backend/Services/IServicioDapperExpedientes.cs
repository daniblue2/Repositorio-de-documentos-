using ProcuraduriaAPI.Models;

namespace ProcuraduriaAPI.Services
{
    public interface IServicioDapperExpedientes
    {
        Task<List<Expediente>> DameTodosLosExpedientes();
        Task<Expediente?> DameExpedientePorId(int id);
        Task<Expediente> CrearExpediente(Expediente nuevoExpediente);
        Task<Expediente> ActualizarExpediente(int id, Expediente expedienteActualizar);
        Task<Expediente?> EliminarExpediente(int id);
        Task<List<Expediente>> BuscarExpedientes(string? numero, string? nombre, string? tipoCaso);
        Task<ResumenEstadisticas> ObtenerResumenEstadisticas();
        Task<List<EstadisticaPorMes>> ObtenerCasosPorMes(int año = 0);
        Task<List<EstadisticaPorEdad>> ObtenerCasosPorRangoEdad();
        Task<List<EstadisticaPorGenero>> ObtenerCasosPorGenero();
        Task<List<EstadisticaGrupoVulnerable>> ObtenerCasosPorGrupoVulnerable();
        Task<EstadisticasPorMes> ObtenerCasosPorMesEspecifico(int mes, int año);
    }
}