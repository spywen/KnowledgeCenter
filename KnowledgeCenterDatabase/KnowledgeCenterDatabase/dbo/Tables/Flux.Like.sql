CREATE TABLE [dbo].[Flux.Like] (
    [Id]            INT           IDENTITY (1, 1) NOT NULL,
    [PublicationId] INT           NOT NULL,
    [UserId]        INT           NOT NULL,
    [CreationDate]  DATETIME      NOT NULL,
    [LikeCode]      NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Flux.Like] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Flux.Like_Flux.Publication] FOREIGN KEY ([PublicationId]) REFERENCES [dbo].[Flux.Publication] ([Id]),
    CONSTRAINT [FK_Flux.Like_Security.User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Security.User] ([Id])
);

