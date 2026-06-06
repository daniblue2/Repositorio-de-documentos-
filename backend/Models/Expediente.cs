namespace ProcuraduriaAPI.Models
{
    public class Expediente
    {
        public int Id { get; set; }
        public string NumeroExpediente { get; set; }
        public string NombrePersona { get; set; }
        public string TipoCaso { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaRegistro { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public string? Genero { get; set; }
    }
}