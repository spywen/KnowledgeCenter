CREATE TABLE [dbo].[Security.Role] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [Code]        VARCHAR (50)  NOT NULL,
    [Description] VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Security.Role] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Security.Role_Security.Role] FOREIGN KEY ([Id]) REFERENCES [dbo].[Security.Role] ([Id])
);

