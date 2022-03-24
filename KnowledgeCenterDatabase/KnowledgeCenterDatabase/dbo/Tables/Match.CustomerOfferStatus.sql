CREATE TABLE [dbo].[Match.CustomerOfferStatus] (
    [Id]          INT          IDENTITY (1, 1) NOT NULL,
    [Code]        VARCHAR (20)                 NOT NULL,
    [Description] VARCHAR (100)                NOT NULL,
    CONSTRAINT [Match.CustomerOfferStatus_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC)
);
GO