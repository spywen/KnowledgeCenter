namespace KnowledgeCenter.Green.Contracts
{
    public class User
    {
        public User() { }

        public int Id { get; set; }

        public string Login { get; set; }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }

        public string Fullname
        {
            get
            {
                return $"{Firstname} {Lastname}";
            }
        }
    }
}
