using System;

namespace KnowledgeCenter.Common
{
    public class BasePaginationResponse<T> : BasePagination
    {
        public BasePaginationResponse(T data, BasePagination query, int totalItems)
        {
            Data = data;
            Page = query.Page;
            Size = query.Size;
            TotalItems = totalItems;
        }

        public T Data { get; set; }

        public int TotalItems { get; set; }

        public int TotalPages
        {
            get
            {
                var numberOfPageAsDouble = ((double)TotalItems / Size);
                if (numberOfPageAsDouble < 1)
                {
                    return 1;
                }
                return (int)Math.Ceiling(numberOfPageAsDouble);
            }
        }
    }
}
