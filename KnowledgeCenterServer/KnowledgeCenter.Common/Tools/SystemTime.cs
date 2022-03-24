using System;

namespace KnowledgeCenter.Common.Tools
{
    public static class SystemTime
    {
        public static Func<DateTime> UtcNow { get; set; } = () => DateTime.UtcNow;

        public static void Reset()
        {
            UtcNow = () => DateTime.UtcNow;
        }
    }
}
