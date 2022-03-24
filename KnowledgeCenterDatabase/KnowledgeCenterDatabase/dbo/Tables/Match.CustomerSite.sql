CREATE TABLE [dbo].[Match.CustomerSite] (
    [Id]               INT           IDENTITY (1, 1) NOT NULL,
    [CustomerId]       INT           NOT NULL,
    [Name]             VARCHAR (100) NOT NULL,
    [Address]          TEXT          NOT NULL,
    [Contact]          TEXT          NULL,
    [CreationDate]     DATETIME      NOT NULL,
    [ModificationDate] DATETIME      NOT NULL,
    CONSTRAINT [Match.CustomerSite_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC),
    CONSTRAINT [Match.CustomerSite_Match.Customer_Id_fk] FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Match.Customer] ([Id])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [Match.CustomerSite_Id_uindex]
    ON [dbo].[Match.CustomerSite]([Id] ASC);

