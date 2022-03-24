CREATE TABLE [dbo].[Match.CustomerOffer] (
    [Id]                       INT          IDENTITY (1, 1) NOT NULL,
    [JobTitle]                 VARCHAR (40)                 NOT NULL,
    [Requester]                VARCHAR (40)                 NULL,
    [CreationDate]             DATETIME                     NOT NULL,
    [ModificationDate]         DATETIME                     NOT NULL,
    [MissionStartDate]         DATETIME                     NOT NULL,
    [MissionEndDate]           DATETIME                     NOT NULL,
    [MobilityRequired]         BIT           DEFAULT 0      NOT NULL,
    [OnSite]                   BIT           DEFAULT 1      NOT NULL,
    [WorkFromHome]             BIT           DEFAULT 0      NOT NULL,
    [CustomerOfferStatusId]    INT                          NOT NULL,
    [Description]              VARCHAR(MAX)                 NULL,
    [CustomerAccountManagerId] INT                          NOT NULL,
    [CustomerSiteId]           INT                          NOT NULL,
    CONSTRAINT [Security.CustomerOffer_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC),
    CONSTRAINT [Match.CustomerOffer_Security.CustomerOfferStatus_Id_fk] FOREIGN KEY ([CustomerOfferStatusId]) REFERENCES [dbo].[Match.CustomerOfferStatus] ([Id]),
    CONSTRAINT [Match.CustomerOffer_Security.User_Id_fk] FOREIGN KEY ([CustomerAccountManagerId]) REFERENCES [dbo].[Security.User] ([Id]),
   	CONSTRAINT [Match.CustomerOffer.CustomerSiteId] FOREIGN KEY ([CustomerSiteId]) REFERENCES [dbo].[Match.CustomerSite] ([Id])
);
GO

CREATE UNIQUE NONCLUSTERED INDEX [Match.CustomerOffer_Id_uindex]
    ON [dbo].[Match.CustomerOffer]([Id] ASC);
GO