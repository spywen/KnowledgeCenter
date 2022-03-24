using KnowledgeCenter.CapLab.Providers;
using KnowledgeCenter.CapLab.Providers._Interfaces;
using KnowledgeCenter.Common._Interfaces;
using KnowledgeCenter.Common.Providers;
using KnowledgeCenter.Common.Providers._Interfaces;
using KnowledgeCenter.Common.Providers.Security;
using KnowledgeCenter.Common.Security;
using KnowledgeCenter.CommonServices._Interfaces;
using KnowledgeCenter.CommonServices.Emails;
using KnowledgeCenter.Flux.Providers;
using KnowledgeCenter.Flux.Providers._Interfaces;
using KnowledgeCenter.Green.Providers;
using KnowledgeCenter.Green.Providers._Interfaces;
using KnowledgeCenter.Match.Providers;
using KnowledgeCenter.Match.Providers._Interfaces;
using KnowledgeCenter.Covid.Providers;
using KnowledgeCenter.Covid.Providers.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SendGrid;

namespace KnowledgeCenterServer
{
    /// <summary>
    /// Dependency injection initializer
    /// </summary>
    public static partial class ServiceCollectionExtension
    {
        /// <summary>
        /// Register dependencies when startup
        /// </summary>
        public static void InitializeDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            RegisterDependenciesForProviders(services);
            RegisterDependenciesForOthers(services, configuration);
        }

        /// <summary>
        /// Register Providers dependencies
        /// </summary>
        /// <param name="services"></param>
        private static void RegisterDependenciesForProviders(this IServiceCollection services)
        {
            services.AddSingleton<IPasswordProvider, PasswordProvider>();
            services.AddTransient<IIdentityProvider, IdentityProvider>();
            services.AddTransient<KnowledgeCenter.Common.Providers._Interfaces.IConfigurationProvider, KnowledgeCenter.Common.Providers.ConfigurationProvider>();
            services.AddTransient<IJwTokenProvider, JwTokenProvider>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddTransient<IEmailTemplateBuilder, EmailTemplateBuilder>();

            services.AddTransient<IUserProvider, UserProvider>();
            services.AddTransient<IRoleProvider, RoleProvider>();
            services.AddTransient<ICountryProvider, CountryProvider>();
            services.AddTransient<IAgencyProvider, AgencyProvider>();
            services.AddTransient<IServiceLineProvider, ServiceLineProvider>();
            services.AddTransient<IRecoverPasswordProvider, RecoverPasswordProvider>();

            services.AddTransient<ISkillProvider, SkillProvider>();
            services.AddTransient<ISkillLevelProvider, SkillLevelProvider>();
            services.AddTransient<ICollaboratorProvider, CollaboratorProvider>();
            services.AddTransient<ICustomerProvider, CustomerProvider>();
            services.AddTransient<ICustomerSiteProvider, CustomerSiteProvider>();
            services.AddTransient<ICustomerOfferStatusProvider, CustomerOfferStatusProvider>();
            services.AddTransient<ICustomerOfferProvider, CustomerOfferProvider>();
            services.AddTransient<IMatchingProvider, MatchingProvider>();
            services.AddTransient<IMatchingScorePerSkillProvider, MatchingScorePerSkillProvider>();

            services.AddTransient<IProjectProvider, ProjectProvider>();
            services.AddTransient<ITagProvider, TagProvider>();

            services.AddTransient<IFluxProvider, FluxProvider>();
            services.AddTransient<IPublicationProvider, PublicationProvider>();

            services.AddTransient<ICovidProvider, CovidProvider>();
            services.AddTransient<ICovidImportProvider, CovidImportProvider>();
        }

        private static void RegisterDependenciesForOthers(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IUserIdProvider, LoginBasedUserIdProvider>();

            services.Configure<SendGridClientOptions>(configuration.GetSection("Emails"));
            services.AddScoped<ISendGridClient, SendGridClientProxy>();
        }
    }
}
