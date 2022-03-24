CREATE TABLE [dbo].[Security.Agency] (
    [id]         INT          IDENTITY (1, 1) NOT NULL,
    [Name]       VARCHAR (50) NOT NULL,
    [PostalCode] VARCHAR (5)  NOT NULL,
    CONSTRAINT [Security.Agency_pk] PRIMARY KEY NONCLUSTERED ([id] ASC)
);




GO
CREATE UNIQUE NONCLUSTERED INDEX [Security.Agency_id_uindex]
    ON [dbo].[Security.Agency]([id] ASC);

