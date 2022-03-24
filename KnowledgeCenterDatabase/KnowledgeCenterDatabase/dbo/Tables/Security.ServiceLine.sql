CREATE TABLE [dbo].[Security.ServiceLine] (
    [Id]          INT           IDENTITY (1, 1) NOT NULL,
    [Name]        VARCHAR (100) NOT NULL,
    [Description] VARCHAR (100) NOT NULL,
    CONSTRAINT [Security.ServiceLine_pk] PRIMARY KEY NONCLUSTERED ([Id] ASC)
);




GO
CREATE UNIQUE NONCLUSTERED INDEX [Security.ServiceLine_Id_uindex]
    ON [dbo].[Security.ServiceLine]([Id] ASC);

