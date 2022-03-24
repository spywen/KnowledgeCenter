CREATE TABLE [dbo].[Security.User] (
    [Id]                         INT           IDENTITY (1, 1) NOT NULL,
    [Firstname]                  VARCHAR (50)  NOT NULL,
    [Lastname]                   VARCHAR (50)  NOT NULL,
    [Email]                      VARCHAR (100) NOT NULL,
    [Login]                      VARCHAR (50)  NOT NULL,
    [Password]                   VARCHAR (200) NOT NULL,
    [PasswordTryCount]           INT           NOT NULL,
    [IsActive]                   BIT           NOT NULL,
    [ModificationDate]           DATETIME      NOT NULL,
    [CreationDate]               DATETIME      NOT NULL,
    [LastConnection]             DATETIME      NULL,
    [Salt]                       VARCHAR (200) NULL,
    [Language]                   VARCHAR (2)   CONSTRAINT [DF_Security.User_Language] DEFAULT ('en') NOT NULL,
    [AgencyId]                   INT           NOT NULL,
    [ServiceLineId]              INT           NULL,
    [RefreshToken]               VARCHAR (50)  NULL,
    [RefreshTokenExpirationDate] DATETIME      NULL,
    [RecoverPasswordToken]       VARCHAR (50)  NULL,
    [ActivationToken]            VARCHAR (50)  NULL,
    [IsDeleted]                  BIT           CONSTRAINT [DF_Security.User_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Security.User] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [Security.User_Security.Agency_id_fk] FOREIGN KEY ([AgencyId]) REFERENCES [dbo].[Security.Agency] ([id]),
    CONSTRAINT [Security.User_Security.ServiceLine_Id_fk] FOREIGN KEY ([ServiceLineId]) REFERENCES [dbo].[Security.ServiceLine] ([Id])
);








GO
