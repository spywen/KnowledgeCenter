CREATE TABLE [dbo].[Common.Country] (
    [Id]      INT            IDENTITY (1, 1) NOT NULL,
    [Code]    NVARCHAR (2)   NOT NULL,
    [Name]    NVARCHAR (100) NOT NULL,
    [FR_Name] NVARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Common.Country] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_Common.Country]
    ON [dbo].[Common.Country]([Code] ASC);

