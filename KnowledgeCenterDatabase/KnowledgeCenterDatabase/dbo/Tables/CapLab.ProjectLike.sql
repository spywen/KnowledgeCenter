CREATE TABLE [dbo].[CapLab.ProjectLike] (
    [Id]           INT      IDENTITY (1, 1) NOT NULL,
    [DateCreation] DATETIME NOT NULL,
    [UserId]       INT      NOT NULL,
    [ProjectId]    INT      NOT NULL,
    [Rate]         INT      NOT NULL,
    CONSTRAINT [PK_CapLab.ProjectLike] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_CapLab.ProjectLike_CapLab.Project] FOREIGN KEY ([ProjectId]) REFERENCES [dbo].[CapLab.Project] ([Id]),
    CONSTRAINT [FK_CapLab.ProjectLike_Security.User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Security.User] ([Id])
);










GO

GO
CREATE TRIGGER UpdateLikes
   ON  dbo.[CapLab.ProjectLike]
   AFTER INSERT, UPDATE
AS 
BEGIN

	DECLARE @ProjectId int
	DECLARE @NewRate float

	UPDATE dbo.[CapLab.Project] SET 
	LikeAverage = avgRate,
	LikeCount = lc
	FROM 
		(SELECT ProjectId, AVG(CAST(Rate as FLOAT)) avgRate, Count(*) lc
		FROM dbo.[CapLab.ProjectLike] c 
		GROUP BY ProjectId) pj
	WHERE pj.ProjectId = Id

END