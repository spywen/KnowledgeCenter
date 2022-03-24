CREATE TABLE [dbo].[Match.Skill] (
    [Id]            INT           IDENTITY (1, 1) NOT NULL,
    [Name]          VARCHAR (100) NOT NULL,
    [ServiceLineId] INT           DEFAULT (NULL) NULL,
    CONSTRAINT [Security.Skill_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC),
    CONSTRAINT [Match.Skill_Security.ServiceLine_Id_fk] FOREIGN KEY ([ServiceLineId]) REFERENCES [dbo].[Security.ServiceLine] ([Id])
);
GO

CREATE UNIQUE NONCLUSTERED INDEX [Security.Skill_Id_uindex]
    ON [dbo].[Match.Skill]([Id] ASC);
GO

