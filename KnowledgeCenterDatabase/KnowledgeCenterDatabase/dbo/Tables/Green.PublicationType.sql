CREATE TABLE [dbo].[Green.PublicationType] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [Code]        NVARCHAR (50) NOT NULL,
    [Description] NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Green.PublicationType] PRIMARY KEY CLUSTERED ([Id] ASC)
);

