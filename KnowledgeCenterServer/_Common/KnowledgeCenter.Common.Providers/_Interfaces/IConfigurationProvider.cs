using KnowledgeCenter.Common.Contracts;

namespace KnowledgeCenter.Common.Providers._Interfaces
{
    public interface IConfigurationProvider
    {
        Configurations GetConfigurations();

        bool InitializeE2ETestingData();

        Contracts.LastTokens GetLastTokensForE2eTestingPurpose();
    }
}
