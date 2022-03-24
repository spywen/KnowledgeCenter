using System.ComponentModel.DataAnnotations;

namespace KnowledgeCenter.Common.Contracts
{
    public class User
    {
        public User() { }

        public int Id { get; set; }

        public string Login { get; set; }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }

        public bool IsActive { get; set; }

        public bool HasBeenActivated { get; set; }

        public int PasswordTryCount { get; set; }

        public string Fullname
        {
            get
            {
                return $"{Firstname} {Lastname}";
            }
        }

        public Agency Agency { get; set; }

        public ServiceLine ServiceLine { get; set; }
    }
}
