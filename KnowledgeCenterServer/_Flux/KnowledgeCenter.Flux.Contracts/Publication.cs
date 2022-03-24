using System;
using System.Collections.Generic;

namespace KnowledgeCenter.Flux.Contracts
{
    public class Publication
    {
        public int Id { get; set; }
        public string CategoryCode { get; set; }
        public string Message { get; set; }
        public DateTime CreationDate { get; set; }
        public bool IsAnonymous { get; set; }
        public bool IsOwner { get; set; }
        public User User { get; set; }
        public string UserLike { get; set; }
        public Dictionary<string, int> Likes { get; set; }
        public int Balance { get; set; }
    }
}
