CREATE TABLE [dbo].[Match.Collaborator] (
    [Id]   INT NOT NULL,
    [GGID] INT NOT NULL,
    CONSTRAINT [Match.Collaborator_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC)
);
GO

CREATE UNIQUE NONCLUSTERED INDEX [Match.Collaborator_Id_uindex]
    ON [dbo].[Match.Collaborator]([Id] ASC);
GO

CREATE UNIQUE NONCLUSTERED INDEX [Match.Collaborator_GGID_uindex]
    ON [dbo].[Match.Collaborator]([GGID] ASC);
GO
