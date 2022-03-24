CREATE TABLE [dbo].[Covid.Stats] (
    [Id]        INT      IDENTITY (1, 1) NOT NULL,
    [Date]      DATETIME NOT NULL,
    [CountryId] INT      NOT NULL,
    [Death]     INT      NOT NULL,
    [Recovered] INT      NOT NULL,
    [Detected]  INT      NOT NULL,
    CONSTRAINT [PK_Covid.Numbers] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Covid.Numbers_Common.Country] FOREIGN KEY ([CountryId]) REFERENCES [dbo].[Common.Country] ([Id])
);

