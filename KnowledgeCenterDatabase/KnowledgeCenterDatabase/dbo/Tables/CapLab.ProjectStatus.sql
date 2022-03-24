CREATE TABLE [dbo].[CapLab.ProjectStatus] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [Code]        NVARCHAR (50) NOT NULL,
    [Description] NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_CapLab.ProjectStatus] PRIMARY KEY CLUSTERED ([Id] ASC)
);

