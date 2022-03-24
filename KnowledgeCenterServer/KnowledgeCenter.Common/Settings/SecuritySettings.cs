namespace KnowledgeCenter.Common.Settings
{
    public class SecuritySettings
    {
        public string Subject { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }

        public int ExpirationInSeconds { get; set; }

        public int SlidingDelayToRefreshTokenAfterTokenExpirationInSeconds { get; set; }

        public string SecretKey { get; set; }

        public string RobotPassword { get; set; }
    }
}
