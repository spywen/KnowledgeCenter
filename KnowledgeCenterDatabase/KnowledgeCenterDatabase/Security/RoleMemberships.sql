ALTER ROLE [db_owner] ADD MEMBER [useraccess];


GO
ALTER ROLE [db_ddladmin] ADD MEMBER [useraccess];


GO
ALTER ROLE [db_datareader] ADD MEMBER [serveraccess];


GO
ALTER ROLE [db_datawriter] ADD MEMBER [serveraccess];

