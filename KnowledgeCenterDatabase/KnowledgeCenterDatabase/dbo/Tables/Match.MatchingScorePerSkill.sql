CREATE TABLE [dbo].[Match.MatchingScorePerSkill] (
    [Id]                   INT        IDENTITY (1, 1) NOT NULL,
    [MatchingId]           INT        NOT NULL,
    [Score]                FLOAT (53) NOT NULL,
    [SkillLevelId]         INT        NOT NULL,
    [CustomerOfferSkillId] INT        NOT NULL,
    CONSTRAINT [Match.MatchingScorePerSkill_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC),
    CONSTRAINT [Match.MatchingScorePerSkill_Match.Matching_id_fk] FOREIGN KEY ([MatchingId]) REFERENCES [dbo].[Match.Matching] ([Id]),
    CONSTRAINT [Match.MatchingScorePerSkill_Match.SkillLevel_Id_fk] FOREIGN KEY ([SkillLevelId]) REFERENCES [dbo].[Match.SkillLevel] ([Id]),
    CONSTRAINT [Match.MatchingScorePerSkill_Match.CustomerOfferSkill_Id_fk] FOREIGN KEY ([CustomerOfferSkillId]) REFERENCES [dbo].[Match.CustomerOfferSkill] ([Id])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [Match.MatchingScorePerSkill_Id_uindex]
    ON [dbo].[Match.MatchingScorePerSkill]([Id] ASC);

