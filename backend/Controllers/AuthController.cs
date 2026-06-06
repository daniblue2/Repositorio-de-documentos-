using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ProcuraduriaAPI.Models;
using Dapper;

namespace ProcuraduriaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly Dbcontext _dbContext;

        public AuthController(Dbcontext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                using var connection = _dbContext.CreateConnection();

                var sql = @"
                    SELECT Id, Usuario, NombreCompleto, Rol, Activo, ContrasenaHash 
                    FROM Usuarios 
                    WHERE Usuario = @Usuario";

                var usuario = await connection.QueryFirstOrDefaultAsync<UsuarioTemp>(sql, new
                {
                    Usuario = request.Username
                });

                if (usuario == null)
                {
                    return Unauthorized(new { message = "Usuario no encontrado" });
                }

                var passwordHash = HashPassword(request.Password);
                var isValid = passwordHash.Equals(Convert.ToHexString(usuario.ContrasenaHash), StringComparison.OrdinalIgnoreCase);

                if (!isValid)
                {
                    return Unauthorized(new { message = "Contraseña incorrecta" });
                }

                var token = GenerarToken(usuario.Id, usuario.Usuario, usuario.Rol);

                return Ok(new
                {
                    success = true,
                    message = "Login exitoso",
                    token = token,
                    usuario = new
                    {
                        usuario.Id,
                        usuario.Usuario,
                        usuario.NombreCompleto,
                        usuario.Rol
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }

        private string GenerarToken(int id, string username, string rol)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("EstaEsMiClaveSuperSecretaParaJWT2026!"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, rol ?? "Usuario"),
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UsuarioTemp
    {
        public int Id { get; set; }
        public string Usuario { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public bool Activo { get; set; }
        public byte[] ContrasenaHash { get; set; } = new byte[32];
    }
}