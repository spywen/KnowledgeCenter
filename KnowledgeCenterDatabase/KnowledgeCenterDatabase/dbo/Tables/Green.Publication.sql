CREATE TABLE [dbo].[Green.Publication] (
    [Id]                INT            IDENTITY (1, 1) NOT NULL,
    [Message]           NVARCHAR (400) NOT NULL,
    [CreationDate]      DATETIME       NOT NULL,
    [ModificationDate]  DATETIME       NOT NULL,
    [PublicationDate]   DATETIME       NOT NULL,
    [UserId]            INT            NOT NULL,
    [PublicationTypeId] INT            NOT NULL,
    CONSTRAINT [PK_Green.Publication] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Green.Publication_Security.User] FOREIGN KEY ([PublicationTypeId]) REFERENCES [dbo].[Green.PublicationType] ([Id])
);

