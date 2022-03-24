using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities
{
    [Table("Security.Role")]
    public class Role
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }

        public ICollection<UserRoles> UserRoles { get; set; }
    }
}
