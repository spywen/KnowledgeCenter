using AutoMapper;
using KnowledgeCenter.DataConnector;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;

namespace KnowledgeCenter.Match.Providers.Tests.Helpers
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

        public Mapper MapperWithoutMock
        {
            get
            {
                var configuration = new MapperConfiguration(cfg => cfg.AddMaps(typeof(_Mappings).Assembly));
                return new Mapper(configuration);
            }
        }
    }
}