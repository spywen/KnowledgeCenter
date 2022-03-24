using KnowledgeCenter.Common.Contracts;

namespace KnowledgeCenter.Common.Providers._Interfaces
{
    public interface IRecoverPasswordProvider
    {
        void AskForRecoverPassword(AskForRecoverPassword askForRecoverPassword);

        void RecoverPasswordThanksToToken(RecoverPassword recoverPassword);
    }
}
