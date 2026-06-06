using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProcuraduriaAPI.Models;
using ProcuraduriaAPI.Services;

namespace ProcuraduriaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExpedientesDapperController : ControllerBase
    {
        private readonly IServicioDapperExpedientes _servicioDapper;

        public ExpedientesDapperController(IServicioDapperExpedientes servicioDapper)
        {
            _servicioDapper = servicioDapper;
        }

        // ==================== ENDPOINTS EXISTENTES ====================

        [HttpGet]
        public async Task<ActionResult<List<Expediente>>> DameTodos()
        {
            var expedientes = await _servicioDapper.DameTodosLosExpedientes();
            return Ok(expedientes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Expediente>> DamePorId(int id)
        {
            var expediente = await _servicioDapper.DameExpedientePorId(id);
            if (expediente == null)
                return NotFound();
            return Ok(expediente);
        }

        [HttpGet("buscar")]
        public async Task<ActionResult<List<Expediente>>> Buscar(
            [FromQuery] string? numero,
            [FromQuery] string? nombre,
            [FromQuery] string? tipoCaso)
        {
            var expedientes = await _servicioDapper.BuscarExpedientes(numero, nombre, tipoCaso);
            return Ok(expedientes);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Expediente>> Crear(Expediente expediente)
        {
            var nuevoExpediente = await _servicioDapper.CrearExpediente(expediente);
            return CreatedAtAction(nameof(DamePorId), new { id = nuevoExpediente.Id }, nuevoExpediente);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Expediente>> Actualizar(int id, Expediente expediente)
        {
            if (id != expediente.Id)
                return BadRequest("El ID no coincide");

            var resultado = await _servicioDapper.ActualizarExpediente(id, expediente);
            return Ok(resultado);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Expediente>> Eliminar(int id)
        {
            var expediente = await _servicioDapper.EliminarExpediente(id);
            if (expediente == null)
                return NotFound();
            return Ok(expediente);
        }

        // ==================== ENDPOINTS DE ESTADÍSTICAS ====================

        [HttpGet("estadisticas/resumen")]
        public async Task<ActionResult<ResumenEstadisticas>> GetResumenEstadisticas()
        {
            var resumen = await _servicioDapper.ObtenerResumenEstadisticas();
            return Ok(resumen);
        }

        [HttpGet("estadisticas/por-mes")]
        public async Task<ActionResult<List<EstadisticaPorMes>>> GetCasosPorMes([FromQuery] int año = 0)
        {
            var estadisticas = await _servicioDapper.ObtenerCasosPorMes(año);
            return Ok(estadisticas);
        }

        [HttpGet("estadisticas/por-edad")]
        public async Task<ActionResult<List<EstadisticaPorEdad>>> GetCasosPorRangoEdad()
        {
            var estadisticas = await _servicioDapper.ObtenerCasosPorRangoEdad();
            return Ok(estadisticas);
        }

        [HttpGet("estadisticas/por-genero")]
        public async Task<ActionResult<List<EstadisticaPorGenero>>> GetCasosPorGenero()
        {
            var estadisticas = await _servicioDapper.ObtenerCasosPorGenero();
            return Ok(estadisticas);
        }

        [HttpGet("estadisticas/grupos-vulnerables")]
        public async Task<ActionResult<List<EstadisticaGrupoVulnerable>>> GetCasosPorGrupoVulnerable()
        {
            var estadisticas = await _servicioDapper.ObtenerCasosPorGrupoVulnerable();
            return Ok(estadisticas);
        }

        [HttpGet("estadisticas/por-mes-especifico")]
        public async Task<ActionResult<EstadisticasPorMes>> GetCasosPorMesEspecifico(
            [FromQuery] int mes,
            [FromQuery] int año)
        {
            var estadisticas = await _servicioDapper.ObtenerCasosPorMesEspecifico(mes, año);
            return Ok(estadisticas);
        }
    }
}