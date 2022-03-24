using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.Common.Settings;
using KnowledgeCenter.DataConnector;
using KnowledgeCenterServer.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerUI;
using AutoMapper;
using System.Reflection;
using KnowledgeCenter.Common.Providers;
using Microsoft.Data.Sqlite;
using KnowledgeCenter.Common;

namespace KnowledgeCenterServer
{
    /// <summary>
    /// Startup
    /// </summary>
    public class Startup
    {
        private const string TokenExpiredHeader = "Token-Expired";

        /// <summary>
        /// Configuration
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// Hosting environment
        /// </summary>
        public IHostingEnvironment Environment { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="environment"></param>
        public Startup(
            IConfiguration configuration,
            IHostingEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        /// <summary>
        /// Configure services
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddMvc(options =>
                {
                    options.Filters.Add(new ExceptionFilter());
                    options.Filters.Add(new ContractValidationFilter());
                })
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddProgressiveWebApp("manifest.json");

            // SETTINGS
            services.Configure<SecuritySettings>(Configuration.GetSection("SecuritySettings"));
            services.Configure<EmailSettings>(Configuration.GetSection("Emails"));
            services.Configure<SiteSettings>(Configuration.GetSection("Site"));

            // DEPENDENCIES
            services.InitializeDependencies(Configuration);

            // DB
            if (Environment.IsEnvironment(EnvironmentEnum.E2e.ToString()))
            {
                var connection = new SqliteConnection("DataSource=:memory:");
                connection.Open();
                services.AddDbContext<KnowledgeCenterContext>(options => options.UseSqlite(connection));
            }
            else
            {
                services.AddDbContext<KnowledgeCenterContext>
                    (options => options.UseSqlServer(Configuration.GetSection("SqlConnection:ConnectionString").Value));
            }

            // SECURITY
            ConfigureJwt(services);

            // SWAGGER
            services.AddSwaggerGen(s =>
            {
                s.SwaggerDoc("v1", new Swashbuckle.AspNetCore.Swagger.Info { Title = "KnowledgeCenter portal API", Version = "v1" });
                var filePath = Path.Combine(PlatformServices.Default.Application.ApplicationBasePath, @"KnowledgeCenterServer.xml");
                s.IncludeXmlComments(filePath);
                s.DescribeAllEnumsAsStrings();
                s.CustomSchemaIds(i => i.FullName);

                s.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    In = "header",
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
                    Name = "Authorization",
                    Type = "apiKey"
                });

                s.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>>
                {
                    { "Bearer", new string[] { } }
                });
            });

            // AUTOMAPPER
            var assemblies = new List<Assembly> {
                typeof(_Mappings).Assembly, // Get common provider assembly
                typeof(KnowledgeCenter.Match.Providers._Mappings).Assembly,
                typeof(KnowledgeCenter.CapLab.Providers._Mappings).Assembly,
                typeof(KnowledgeCenter.Flux.Providers._Mappings).Assembly,
                typeof(KnowledgeCenter.Green.Providers._Mappings).Assembly
            };
            services.AddAutoMapper(assemblies);

            // SIGNALR
            services.AddSignalR();
        }

        /// <summary>
        /// Configure
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                Trace.TraceInformation("--- DEV ---");
                app.UseDeveloperExceptionPage();

                //SWAGGER
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.DocumentTitle = "KnowledgeCenter portal API";
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "KnowledgeCenter API");
                    c.DisplayRequestDuration();
                    c.DocExpansion(DocExpansion.None);
                });

                app.UseCors(builder => builder
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
                    .AllowCredentials()
                    .WithOrigins("http://localhost:4200")
                    .WithExposedHeaders(TokenExpiredHeader));
            }
            else if (env.EnvironmentName == EnvironmentEnum.E2e.ToString())
            {
                // FIX CORS ISSUE (E2E testing is running UI on different localhost URL but not BE which is stored on Azure)
                app.UseCors(builder => builder
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
                    .AllowCredentials()
                    .WithOrigins("http://localhost:4200", "http://localhost:5000")
                    .WithExposedHeaders(TokenExpiredHeader));

                using (var serviceScope = app.ApplicationServices.CreateScope())
                {
                    var context = serviceScope.ServiceProvider.GetService<KnowledgeCenterContext>();
                    context.Database.EnsureCreated();
                }
            }
            else
            {
                Trace.TraceInformation("--- PROD ---");
                app.UseHsts();
            }

            app.Use(async (httpContext, next) =>
            {
                await next();
                if (httpContext.Response.StatusCode == 404 &&
                   !Path.HasExtension(httpContext.Request.Path.Value) &&
                   !httpContext.Request.Path.Value.StartsWith("/api/") &&
                   !httpContext.Request.Path.Value.StartsWith("/swagger"))
                {
                    httpContext.Request.Path = "/index.html";
                    await next();
                }
            });

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseMvc();
            app.UseMvcWithDefaultRoute();
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // All new sockets route should be initialized here
            app.UseSignalR(routes =>
            {
                routes.MapHub<KnowledgeCenter.Flux.Providers.PublicationSocketHub>("/sockets/flux");
            });
        }

        private void ConfigureJwt(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters =
                             new TokenValidationParameters
                             {
                                 ValidateIssuer = true,
                                 ValidateAudience = true,
                                 ValidateLifetime = true,
                                 ValidateIssuerSigningKey = true,
                                 RoleClaimType = CustomClaims.RoleClaimCode,
                                 ValidIssuer = Configuration["SecuritySettings:Issuer"],
                                 ValidAudience = Configuration["SecuritySettings:Audience"],
                                 IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration["SecuritySettings:SecretKey"]))
                             };
                        options.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context => // For socket purpose only
                            {
                                var path = context.HttpContext.Request.Path;
                                var accessToken = context.Request.Query["access_token"];
                                if (!string.IsNullOrEmpty(accessToken) &&
                                    path.StartsWithSegments("/sockets"))
                                {
                                    context.Token = accessToken;
                                }
                                return Task.CompletedTask;
                            },
                            OnAuthenticationFailed = context =>
                            {
                                Trace.TraceInformation($"[JWT ERROR] Authentication failed: {context.Exception.Message}");
                                if (context.Exception is SecurityTokenExpiredException)
                                {
                                    context.Response.Headers.Add(TokenExpiredHeader, "true");
                                }
                                return Task.CompletedTask;
                            },
                            OnTokenValidated = context =>
                            {
                                return Task.CompletedTask;
                            }
                        };
                    });
        }
    }
}
