using System;
using System.Collections.Generic;

namespace KnowledgeCenter.CapLab.Contracts
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }

        public User User { get; set; }
        public ProjectStatus Status { get; set; }
        public List<Tag> Tags { get; set; }

        public int LikeCount { get; set; }
        public decimal LikeAverageRate { get; set; }
        public ProjectLike MyLike { get; set; }
        public string ApproverFullName { get; set; }
    }
}
