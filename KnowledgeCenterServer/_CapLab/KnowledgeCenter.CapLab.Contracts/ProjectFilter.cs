using System.Collections.Generic;

namespace KnowledgeCenter.CapLab.Contracts
{
    public class ProjectFilter
    {
        public bool IsOnlyMine { get; set; } = false;
        public string Keyword { get; set; }
        public List<string> StatusCodes { get; set; } = new List<string>();

        public bool OrderByDescendingCreationDate { get; set; } = false;
    }
}
