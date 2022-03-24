CREATE TABLE [dbo].[Flux.Publication] (
    [Id]               INT             IDENTITY (1, 1) NOT NULL,
    [CategoryCode]     NVARCHAR (50)   NOT NULL,
    [Message]          NVARCHAR (4000) NOT NULL,
    [CreationDate]     DATETIME        NOT NULL,
    [ModificationDate] DATETIME        NOT NULL,
    [IsAnonymous]      BIT             NOT NULL,
    [UserId]           INT             NOT NULL,
    CONSTRAINT [PK_Flux.Publication] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Flux.Publication_Security.User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Security.User] ([Id])
);



