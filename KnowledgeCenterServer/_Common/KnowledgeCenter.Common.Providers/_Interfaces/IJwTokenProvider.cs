using KnowledgeCenter.Common.Contracts;
using KnowledgeCenter.Common.Security;
using System.Collections.Generic;

namespace KnowledgeCenter.Common.Providers._Interfaces
{
    public interface IJwTokenProvider
    {
        JwToken GenerateTokens(Credentials credentials);

        JwToken GenerateTokensFromRefreshToken(Tokens tokens);

        void ClearRefreshToken();

        List<string> GetRoles();
    }
}
