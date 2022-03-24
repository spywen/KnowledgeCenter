using System;

namespace KnowledgeCenter.Common.Security
{
    public static class Sanitizer
    {
        public static string SanitizeGuid(this Guid guid)
        {
            string encoded = Convert.ToBase64String(guid.ToByteArray());
            encoded = encoded
                .Replace("/", "_")
                .Replace("+", "-");
            return encoded.Substring(0, 22);
        }
    }
}
