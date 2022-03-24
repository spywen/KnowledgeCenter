CREATE TABLE [dbo].[CapLab.Project] (
    [Id]               INT             IDENTITY (1, 1) NOT NULL,
    [Title]            NVARCHAR (140)  NOT NULL,
    [ShortDescription] NVARCHAR (300)  NOT NULL,
    [Description]      NVARCHAR (MAX)  NOT NULL,
    [Image]            NVARCHAR (MAX)  NULL,
    [CreationDate]     DATETIME        NOT NULL,
    [UserId]           INT             NOT NULL,
    [ModificationDate] DATETIME        NOT NULL,
    [ProjectStatusId]  INT             NOT NULL,
    [ApproverId]       INT             NULL,
    [LikeAverage]      DECIMAL (18, 2) NOT NULL,
    [LikeCount]        INT             NOT NULL,
    CONSTRAINT [PK_CapLab.Project] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_CapLab.Project_CapLab.ProjectStatus] FOREIGN KEY ([ProjectStatusId]) REFERENCES [dbo].[CapLab.ProjectStatus] ([Id]),
    CONSTRAINT [FK_CapLab.Project_Security.User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Security.User] ([Id]),
    CONSTRAINT [FK_CapLab.Project_Security.User1] FOREIGN KEY ([ApproverId]) REFERENCES [dbo].[Security.User] ([Id])
);



