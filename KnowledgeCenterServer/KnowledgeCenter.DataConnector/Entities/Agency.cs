using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities
{
    [Table("Security.Agency")]
    public class Agency
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PostalCode { get; set; }
    }
}