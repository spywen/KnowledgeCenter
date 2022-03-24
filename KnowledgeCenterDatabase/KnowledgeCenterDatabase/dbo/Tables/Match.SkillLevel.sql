CREATE TABLE [dbo].[Match.SkillLevel] (
    [Id]    INT          IDENTITY (1, 1) NOT NULL,
    [Name]  VARCHAR (20) NOT NULL,
    [Order] INT          DEFAULT (0) NOT NULL,
    CONSTRAINT [Security.SkillLevel_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC)
);
GO
