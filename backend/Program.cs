using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ProcuraduriaAPI.Models;
using ProcuraduriaAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Configurar JWT
var key = Encoding.UTF8.GetBytes("EstaEsMiClaveSuperSecretaParaJWT2026!");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };

        // Para que el token funcione con fetch desde React
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Headers["Authorization"].FirstOrDefault();
                if (token != null && token.StartsWith("Bearer "))
                {
                    context.Token = token.Substring("Bearer ".Length).Trim();
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddScoped<Dbcontext>();
builder.Services.AddScoped<IServicioDapperExpedientes, ServicioDapperExpedientes>();

var app = builder.Build();

app.UseCors("ReactApp");
app.UseAuthentication();  // ← IMPORTANTE: ANTES de UseAuthorization
app.UseAuthorization();

app.MapControllers();
app.Run();