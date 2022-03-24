namespace KnowledgeCenter.Common.Security
{
    public class PasswordAndSalt
    {
        public string PasswordHashed { get; set; }
        public string Salt { get; set; }

        public PasswordAndSalt(string passwordHashed, string salt)
        {
            PasswordHashed = passwordHashed;
            Salt = salt;
        }
    }
}
