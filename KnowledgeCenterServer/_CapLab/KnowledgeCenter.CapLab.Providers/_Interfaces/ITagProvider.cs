using KnowledgeCenter.CapLab.Contracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace KnowledgeCenter.CapLab.Providers._Interfaces
{
    public interface ITagProvider
    {

        List<Tag> GetAllTags();
    }
}
