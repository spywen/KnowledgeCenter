CREATE TABLE [dbo].[Match.Matching] (
    [Id]               INT        IDENTITY (1, 1) NOT NULL,
    [CustomerOfferId]  INT        NOT NULL,
    [CollaboratorId]   INT        NOT NULL,
    [CreationDate]     DATE       NOT NULL,
    [Score]            FLOAT (53) NOT NULL,
    CONSTRAINT [Match.Matching_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC),
    CONSTRAINT [Match.Matching_Match.Collaborator_Id_fk] FOREIGN KEY ([CollaboratorId]) REFERENCES [dbo].[Match.Collaborator] ([Id]),
    CONSTRAINT [Match.Matching_Match.CustomerOffer_Id_fk] FOREIGN KEY ([CustomerOfferId]) REFERENCES [dbo].[Match.CustomerOffer] ([Id])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [Match.Matching_id_uindex]
    ON [dbo].[Match.Matching]([Id] ASC);

