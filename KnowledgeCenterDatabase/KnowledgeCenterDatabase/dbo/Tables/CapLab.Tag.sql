CREATE TABLE [dbo].[CapLab.Tag] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [Code]        NVARCHAR (50)  NOT NULL,
    [Description] NVARCHAR (100) NOT NULL,
    CONSTRAINT [PK_CapLab.Tag] PRIMARY KEY CLUSTERED ([Id] ASC)
);

