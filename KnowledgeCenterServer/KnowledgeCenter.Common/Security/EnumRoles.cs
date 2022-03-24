namespace KnowledgeCenter.Common.Security
{
    public static class EnumRoles
    {
        public const string USER = "USER";
        public const string ROBOT = "ROBOT";
        public const string ADMIN = "ADMIN";
        public const string MATCH_RM = "MATCH_RM";
        public const string MATCH_CAM = "MATCH_CAM";
        public const string MATCH_ADMIN = "MATCH_ADMIN";
        public const string CAPLAB_ADMIN = "CAPLAB_ADMIN";
        public const string FLUX_ADMIN = "FLUX_ADMIN";
        public const string GREEN_ADMIN = "GREEN_ADMIN";

        // External roles (not yet used inside KC)
        public const string DATAVALUE_ADMIN = "DATAVALUE_ADMIN";
        public const string DATAVALUE_USER = "DATAVALUE_USER";
    }
}
