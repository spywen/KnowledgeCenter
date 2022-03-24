using System;
using System.Reflection;

namespace KnowledgeCenter.Common
{
    public class BasePaginationRequest<T> : BasePagination
    {
        public BasePaginationRequest(T filters)
        {
            Filters = filters;
        }

        public T Filters { get; set; }
    }
}
