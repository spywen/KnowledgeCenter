using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities.Green
{
    [Table("Green.PublicationType")]
    public class PublicationType
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }

    public class EnumPublicationType
    {
        public const string ANECDOTE = "ANECDOTE";
        public const string NEWS = "NEWS";
        public const string QUESTION = "QUESTION";
    }
}
