CREATE TABLE [dbo].[Email.Log] (
    [Id]      INT            IDENTITY (1, 1) NOT NULL,
    [Date]    DATETIME       NOT NULL,
    [UserId]  INT            NOT NULL,
    [Subject] NVARCHAR (500) NOT NULL,
    CONSTRAINT [PK_Email.Log] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Email.Log_Security.User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Security.User] ([Id])
);

