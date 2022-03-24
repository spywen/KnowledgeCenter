using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace KnowledgeCenter.DataConnector.Entities
{
    [Table("Security.User")]
    public class User
    {
        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public int PasswordTryCount { get; set; }
        public string Salt { get; set; }
        public bool IsActive { get; set; }
        public DateTime ModificationDate { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastConnection { get; set; }
        public int AgencyId { get; set; }
        public Agency Agency { get; set; }
        public int? ServiceLineId { get; set; }
        public ServiceLine ServiceLine { get; set; }
        public ICollection<UserRoles> UserRoles { get; set; }
        public string RefreshToken { get; set; }
        public DateTime? RefreshTokenExpirationDate { get; set; }
        public string RecoverPasswordToken { get; set; }
        public string ActivationToken { get; set; }
        public bool IsDeleted { get; set; }
    }
}
