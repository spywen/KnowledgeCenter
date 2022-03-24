using AutoMapper;
using KnowledgeCenter.CapLab.Contracts;
using System.Collections.Generic;
using System.Linq;
using Entities = KnowledgeCenter.DataConnector.Entities;

namespace KnowledgeCenter.CapLab.Providers
{
    public class _Mappings : Profile
    {
        public _Mappings()
        {
            CreateMap<Entities.User, User>();
            CreateMap<Entities.CapLab.ProjectTag, ProjectTag>();
            CreateMap<Entities.CapLab.ProjectLike, ProjectLike>();
            CreateMap<Entities.CapLab.ProjectStatus, ProjectStatus>();
            CreateMap<Entities.CapLab.Tag, Tag>();
            CreateMap<Entities.CapLab.Project, Project>()
                .AfterMap((source, dest, context) =>
                {
                    dest.Tags = context.Mapper.Map<List<Tag>>(source.ProjectTags.Select(x => x.Tag).ToList());
                    dest.LikeCount = source.LikeCount;
                    dest.LikeAverageRate = source.LikeAverage;
                    dest.Status = context.Mapper.Map<ProjectStatus>(source.ProjectStatus);
                    if (context.Items.Any(x => x.Key == "CurrentUserId"))
                    {
                        var currentUserId = int.Parse(context.Items["CurrentUserId"].ToString());
                        dest.MyLike = context.Mapper.Map<ProjectLike>(source.ProjectLikes.SingleOrDefault(x => x.UserId == currentUserId));
                        if (source.UserId == currentUserId && source.Approver != null)
                        {
                            dest.ApproverFullName = $"{source.Approver.Firstname} {source.Approver.Lastname}";
                        }
                    }
                });
        }
    }
}