CREATE TABLE [dbo].[Security.UserRoles] (
    [Id]     INT IDENTITY (1, 1) NOT NULL,
    [UserId] INT NOT NULL,
    [RoleId] INT NOT NULL,
    CONSTRAINT [PK_Security.UserRoles] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Security.UserRoles_Security.Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Security.Role] ([Id]),
    CONSTRAINT [FK_Security.UserRoles_Security.User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Security.User] ([Id])
);

