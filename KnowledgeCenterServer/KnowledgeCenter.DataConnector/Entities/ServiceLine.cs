using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities
{
    [Table("Security.ServiceLine")]
    public class ServiceLine
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}