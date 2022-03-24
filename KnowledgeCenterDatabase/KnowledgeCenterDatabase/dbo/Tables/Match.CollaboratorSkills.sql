CREATE TABLE [dbo].[Match.CollaboratorSkills] (
    [Id]             INT IDENTITY (1, 1) NOT NULL,
    [CollaboratorId] INT NOT NULL,
    [SkillId]        INT NOT NULL,
    [SkillLevelId]   INT NOT NULL,
    CONSTRAINT [Security.CollaboratorSkills_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC),
    CONSTRAINT [Match.CollaboratorSkills_Match.Skill_Id_fk] FOREIGN KEY ([SkillId]) REFERENCES [dbo].[Match.Skill] ([Id]),
    CONSTRAINT [Match.CollaboratorSkills_Match.SkillLevel_Id_fk] FOREIGN KEY ([SkillLevelId]) REFERENCES [dbo].[Match.SkillLevel] ([Id]),
    CONSTRAINT [Match.CollaboratorSkills_Security.User_Id_fk] FOREIGN KEY ([CollaboratorId]) REFERENCES [dbo].[Security.User] ([Id])
);
GO

CREATE UNIQUE NONCLUSTERED INDEX [Match.CollaboratorSkills_Id_uindex]
    ON [dbo].[Match.CollaboratorSkills]([Id] ASC);
GO

