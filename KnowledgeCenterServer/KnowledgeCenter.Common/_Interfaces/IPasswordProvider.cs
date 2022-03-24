using KnowledgeCenter.Common.Security;

namespace KnowledgeCenter.Common._Interfaces
{
    public interface IPasswordProvider
    {
        PasswordAndSalt GenerateNewSaltedPassword(string clearPassword);

        bool IsHistoricPassword(string supposedClearHistoricPassword, string dbSalt, string dbHashedPassword);
    }
}
