CREATE TABLE [dbo].[CapLab.ProjectTag] (
    [Id]        INT IDENTITY (1, 1) NOT NULL,
    [ProjectId] INT NOT NULL,
    [TagId]     INT NOT NULL,
    CONSTRAINT [PK_CapLab.ProjectTags] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_CapLab.ProjectTags_CapLab.Project] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[CapLab.Project] ([Id]),
    CONSTRAINT [FK_CapLab.ProjectTags_CapLab.Tag] FOREIGN KEY ([TagId]) REFERENCES [dbo].[CapLab.Tag] ([Id])
);

