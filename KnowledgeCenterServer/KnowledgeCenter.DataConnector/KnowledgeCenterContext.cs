using KnowledgeCenter.DataConnector.Entities;
using KnowledgeCenter.DataConnector.Entities.CapLab;
using KnowledgeCenter.DataConnector.Entities.Common;
using KnowledgeCenter.DataConnector.Entities.Covid;
using KnowledgeCenter.DataConnector.Entities.Flux;
using KnowledgeCenter.DataConnector.Entities.Green;
using KnowledgeCenter.DataConnector.Entities.Match;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeCenter.DataConnector
{
    public class KnowledgeCenterContext : DbContext
    {
        public KnowledgeCenterContext()
        {
        }

        public KnowledgeCenterContext(DbContextOptions<KnowledgeCenterContext> options)
            : base(options)
        {
        }

        #region Common
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserRoles> UserRoles { get; set; }
        public virtual DbSet<ServiceLine> ServiceLines { get; set; }
        public virtual DbSet<Agency> Agencies { get; set; }
        public virtual DbSet<EmailLog> EmailLogs { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        #endregion

        #region Match
        public virtual DbSet<Collaborator> Collaborators { get; set; }
        public virtual DbSet<Skill> Skills { get; set; }
        public virtual DbSet<CollaboratorSkill> CollaboratorSkills { get; set; }
        public virtual DbSet<SkillLevel> SkillLevels { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<CustomerSite> CustomersSites { get; set; }

        public virtual DbSet<CustomerOffer> CustomerOffers { get; set; }
        public virtual DbSet<CustomerOfferSkill> CustomerOfferSkills { get; set; }
        public virtual DbSet<CustomerOfferStatus> CustomerOffersStatus { get; set; }
        public virtual DbSet<Matching> Matching { get; set; }
        public virtual DbSet<MatchingScorePerSkill> MatchingScoresPerSkill { get; set; }
        #endregion

        #region CapLab
        public virtual DbSet<Project> Projects { get; set; }
        public virtual DbSet<Tag> Tags { get; set; }
        public virtual DbSet<ProjectTag> ProjectTags { get; set; }
        public virtual DbSet<ProjectLike> ProjectLikes { get; set; }
        public virtual DbSet<ProjectStatus> ProjectStatuses { get; set; }
        #endregion

        #region Flux
        public virtual DbSet<Entities.Flux.Publication> FluxPublications { get; set; }
        public virtual DbSet<Like> FluxLikes { get; set; }
        #endregion

        #region Green
        public virtual DbSet<Entities.Green.Publication> Publications { get; set; }
        public virtual DbSet<PublicationType> PublicationTypes { get; set; }
        #endregion

        #region Covid
        public virtual DbSet<Stats> CovidStats { get; set; }
        #endregion
    }
}
