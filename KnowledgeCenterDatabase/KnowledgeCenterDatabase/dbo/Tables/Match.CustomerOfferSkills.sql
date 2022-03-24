
CREATE TABLE [dbo].[Match.CustomerOfferSKill] (
    [Id]              INT IDENTITY (1, 1) NOT NULL,
    [CustomerOfferId] INT                 NOT NULL,
    [SkillId]         INT                 NOT NULL,
    [SkillLevelId]    INT                 NOT NULL,
    [SkillPriority]   INT                 NOT NULL,
    CONSTRAINT [Match.CustomerOfferSkill_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC),
    CONSTRAINT [Match.CustomerOfferSkill_Match.Skill_Id_fk] FOREIGN KEY ([SkillId]) REFERENCES [dbo].[Match.Skill] ([Id]),
    CONSTRAINT [Match.CustomerOfferSkill_Match.SkillLevel_Id_fk] FOREIGN KEY ([SkillLevelId]) REFERENCES [dbo].[Match.SkillLevel] ([Id]),
    CONSTRAINT [Match.CustomerOfferSkill_Match.CustomerOffer_Id_fk] FOREIGN KEY ([CustomerOfferId]) REFERENCES [dbo].[Match.CustomerOffer] ([Id])
);
GO

CREATE UNIQUE NONCLUSTERED INDEX [Match.CustomerOfferSKill_Id_uindex]
    ON [dbo].[Match.CustomerOfferSKill]([Id] ASC);
GO
