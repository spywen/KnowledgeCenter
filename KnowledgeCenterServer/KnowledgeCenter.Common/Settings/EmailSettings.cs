namespace KnowledgeCenter.Common.Settings
{
    public class EmailSettings
    {
        public string ApiKey { get; set; }
        public string FromAddress { get; set; }
        public string FromName { get; set; }
        public int LimitPerMinutes { get; set; }
        public int LimitPerMonth { get; set; }
    }
}
