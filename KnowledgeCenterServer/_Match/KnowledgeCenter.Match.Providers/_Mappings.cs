using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using KnowledgeCenter.Match.Contracts;
using Agency = KnowledgeCenter.Match.Contracts.Agency;
using ServiceLine = KnowledgeCenter.Match.Contracts.ServiceLine;

namespace KnowledgeCenter.Match.Providers
{
    public class _Mappings : Profile
    {
        public _Mappings()
        {
            #region Match

            CreateMap<DataConnector.Entities.Match.Collaborator, Collaborator>();
            CreateMap<DataConnector.Entities.Match.CollaboratorSkill, CollaboratorSkill>();
            CreateMap<DataConnector.Entities.Match.Customer, Customer>();
            CreateMap<DataConnector.Entities.Match.CustomerOffer, CustomerOffer>();
            CreateMap<DataConnector.Entities.Match.CustomerOfferSkill, CustomerOfferSkill>();
            CreateMap<DataConnector.Entities.Match.CustomerOfferStatus, CustomerOfferStatus>();
            CreateMap<DataConnector.Entities.Match.CustomerSite, CustomerSite>();
            CreateMap<DataConnector.Entities.Match.Matching, Matching>();
            CreateMap<DataConnector.Entities.Match.MatchingScorePerSkill, MatchingScorePerSkill>();
            CreateMap<DataConnector.Entities.Match.Skill, Skill>();
            CreateMap<DataConnector.Entities.Match.SkillLevel, SkillLevel>();

            #endregion

            #region Common

            CreateMap<DataConnector.Entities.Agency, Agency>();
            CreateMap<DataConnector.Entities.ServiceLine, ServiceLine>();
            CreateMap<DataConnector.Entities.User, User>();
            CreateMap<DataConnector.Entities.User, Collaborator>()
                .ForMember(dest => dest.Agency, src => src.MapFrom(x => x.Agency))
                .ForMember(dest => dest.ServiceLine, src => src.MapFrom(x => x.ServiceLine))
                .AfterMap((source, dest, opt) =>
                {
                    DataConnector.Entities.Match.Collaborator collaborator = null;
                    if (!opt.Items.ContainsKey(_MappingsParameters.Collaborators)) return;
                    switch (opt.Items[_MappingsParameters.Collaborators])
                    {
                        case List<DataConnector.Entities.Match.Collaborator> _:
                            collaborator =
                                ((List<DataConnector.Entities.Match.Collaborator>) opt.Items[
                                    _MappingsParameters.Collaborators])
                                .SingleOrDefault(x => x.Id == source.Id);
                            break;
                        case DataConnector.Entities.Match.Collaborator _:
                            collaborator =
                                (DataConnector.Entities.Match.Collaborator) opt.Items[
                                    _MappingsParameters.Collaborators];
                            break;
                    }

                    if (collaborator == null) return;
                    dest.GGID = collaborator.GGID;
                    var returnedCollaboratorSkills =
                        opt.Mapper.Map<List<CollaboratorSkill>>(collaborator.CollaboratorSkills);
                    if (returnedCollaboratorSkills.Count > 0)
                    {
                        dest.CollaboratorSkills = returnedCollaboratorSkills;
                    }
                });

            #endregion
        }
    }
}