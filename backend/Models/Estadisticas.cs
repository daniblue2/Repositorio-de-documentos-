namespace ProcuraduriaAPI.Models
{
    public class ResumenEstadisticas
    {
        public int TotalExpedientes { get; set; }
        public int CasosEsteMes { get; set; }
        public int CasosEsteAño { get; set; }
        public int MenoresEdad { get; set; }
        public int AdultosMayores { get; set; }
    }

    public class EstadisticaPorMes
    {
        public string Mes { get; set; } = string.Empty;
        public int NumeroMes { get; set; }
        public int Cantidad { get; set; }
        public int Año { get; set; }
    }

    public class EstadisticaPorEdad
    {
        public string RangoEdad { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public int Porcentaje { get; set; }
    }

    public class EstadisticaPorGenero
    {
        public string Genero { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public int Porcentaje { get; set; }
    }

    public class EstadisticaGrupoVulnerable
    {
        public string Grupo { get; set; } = string.Empty;
        public int Cantidad { get; set; }
    }
}