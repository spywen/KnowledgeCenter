CREATE TABLE [dbo].[Match.Customer] (
    [Id]               INT          IDENTITY (1, 1) NOT NULL,
    [Name]             VARCHAR (50) NOT NULL,
    [CreationDate]     DATETIME     NOT NULL,
    [ModificationDate] DATETIME     NOT NULL,
    CONSTRAINT [Match.Customer_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [Match.Customer_Id_uindex]
    ON [dbo].[Match.Customer]([Id] ASC);

