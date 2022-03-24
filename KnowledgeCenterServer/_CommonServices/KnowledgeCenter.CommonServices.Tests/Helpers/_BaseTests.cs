using KnowledgeCenter.DataConnector;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;

namespace KnowledgeCenter.Common.Providers.Tests.Helpers
{
    public abstract class _BaseTests : IDisposable
    {
        protected static KnowledgeCenterContext GetDbContextMock()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();
            var options = new DbContextOptionsBuilder<KnowledgeCenterContext>()
                    .UseSqlite(connection)
                    .Options;

            var context = new KnowledgeCenterContext(options);
            context.Database.EnsureCreated();
            return context;
        }

        public abstract void Dispose();
    }
}
