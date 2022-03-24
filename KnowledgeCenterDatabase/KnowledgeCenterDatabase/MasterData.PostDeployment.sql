------------------------
--------- ROLE ---------
------------------------
MERGE INTO [dbo].[Security.Role] AS Target
USING
    (
        VALUES
        ('ADMIN', 'Administrator'),
        ('MATCH_ADMIN', 'Match Administrator'),
        ('MATCH_RM', 'Match Resource Manager'),
        ('MATCH_CAM', 'Match Customer Account Manager'),
		('CAPLAB_ADMIN', 'Caplab Administrator'),
		('FLUX_ADMIN', 'Flux Administrator'),
		('GREEN_ADMIN', 'Green Administrator'),
		('DATAVALUE_ADMIN', 'Data Value Administrator'),
		('DATAVALUE_USER', 'Data Value User')
    )
AS Source (Code, Description)
ON Target.Code = Source.Code

-- update matched rows
WHEN MATCHED THEN
    UPDATE SET	Code = Source.Code,
                  Description = Source.Description

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Code, Description)
    VALUES (Source.Code, Source.Description)

--delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;

GO

------------------------
-------- AGENCY --------
------------------------
MERGE INTO [dbo].[Security.Agency] AS Target
USING
    (
        VALUES
        ('Biot', '06410')
    )
AS Source ( Name, PostalCode)
ON Target.PostalCode = Source.PostalCode

-- update matched rows
WHEN MATCHED THEN
    UPDATE SET	Name = Source.Name,
                  PostalCode = Source.PostalCode

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Name, PostalCode)
    VALUES (Source.Name, Source.PostalCode);

GO

------------------------
----- SERVICE LINE -----
------------------------
MERGE INTO [dbo].[Security.ServiceLine] AS Target
USING
    (
        VALUES
        ('DIT', 'Digital Innovation And Technology'),
        ('Move To Cloud', 'Move To Cloud'),
        ('DT&C', 'Digital Technology And Cloud'),
        ('Data Value', 'Data Value'),
        ('Agile & PM', 'Agile and Project Management'),
        ('OM', 'Opérations Métiers')
    )
AS Source (Name, Description)
ON Target.Name = Source.Name

-- update matched rows
WHEN MATCHED THEN
    UPDATE SET	Name = Source.Name,
                Description = Source.Description

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Name, Description)
    VALUES (Source.Name, Source.Description);

GO

------------------------
----- SKILL LEVELS -----
------------------------
MERGE INTO [dbo].[Match.SkillLevel] AS Target
USING
    (
        VALUES
        ('Novice', 1),
        ('Intermediate', 2),
        ('Senior', 3),
        ('Expert', 4)
    )
AS Source (Name, [Order])
ON Target.Name = Source.Name

-- update matched rows
WHEN MATCHED THEN
    UPDATE SET	Name = Source.Name

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Name)
    VALUES (Source.Name)

--delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;

GO

------------------------
--------- USER ---------
------------------------
DECLARE @adminRoleId int
SELECT @adminRoleId = Id
FROM   [dbo].[Security.Role]
WHERE  Code = 'ADMIN';

DECLARE @agencyId int
SELECT @agencyId = id
FROM   [dbo].[Security.Agency]
WHERE  PostalCode = '06410';

MERGE INTO [dbo].[Security.User] AS Target
USING
    (
        VALUES
        ('Super', 'Admin', 'super.admin@capgemini.com', 'admin', 'mWTOLJ2dRg/3UaUqPUpIFzGmNLAM7q1fdZUbvIz58e4=', 0, 1, GETDATE(), GETDATE(), GETDATE(), 'h9CKCnEbNqJ9RwjEBniENQ==', 'en', @agencyId) -- password = admin
    )
AS Source (Firstname, Lastname, Email, Login, Password, PasswordTryCount, IsActive, ModificationDate, CreationDate, LastConnection, Salt, Language, AgencyId)
ON Target.Email = Source.Email

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Firstname, Lastname, Email, Login, Password, PasswordTryCount, IsActive, ModificationDate, CreationDate, LastConnection, Salt, Language, AgencyId)
    VALUES (Source.Firstname, Source.Lastname, Source.Email, Source.Login, Source.Password, Source.PasswordTryCount,
            Source.IsActive, Source.ModificationDate, Source.CreationDate, Source.LastConnection, Source.Salt, Source.Language,
            Source.AgencyId);

DECLARE @superAdminId int
SELECT @superAdminId = Id
FROM   [dbo].[Security.User]
WHERE  Email = 'super.admin@capgemini.com';


INSERT INTO [dbo].[Security.UserRoles]
SELECT @superAdminId, @adminRoleId


------------------------
----- CustomerOfferStatus -----
------------------------
MERGE INTO [dbo].[Match.CustomerOfferStatus] AS Target
USING
    (
        VALUES
        ('OPEN','Open'),
        ('CLOSED','Closed'),
        ('SOURCED','Sourced')
    )
AS Source (Code, Description)
ON Target.Code = Source.Code

-- update matched rows
WHEN MATCHED THEN
    UPDATE SET	Code = Source.Code,
    	        Description = Source.Description

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Code,Description)
    VALUES (Source.Code,Source.Description)

--delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;

GO

------------------------
----- CAPLAB STATUS -----
------------------------
MERGE INTO [dbo].[CapLab.ProjectStatus] AS Target
USING
    (
        VALUES
        ('WAITING', 'Waiting for validation'),
        ('VALIDATED', 'Approved'),
        ('REJECTED', 'Rejected'),
		('INPROGRESS', 'In progress'),
		('FINISHED', 'Finished')
    )
AS Source (Code, Description)
ON Target.Code = Source.Code

-- update matched rows
WHEN MATCHED THEN
    UPDATE SET	Code = Source.Code,
				Description = Source.Description

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Code,Description)
    VALUES (Source.Code,Source.Description)

--delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;

GO

------------------------
----- CAPLAB Tag -----
------------------------
MERGE INTO [dbo].[CapLab.Tag] AS Target
USING
    (
        VALUES
        ('FUN', '#Fun'),
        ('USEFUL', '#UseFull'),
        ('FUTURE', '#Future'),
		('FORCUSTOMERS', '#ForCustomers'),
		('INTERN', '#Intern'),
		('GREEN', '#Green')
    )
AS Source (Code, Description)
ON Target.Code = Source.Code

-- update matched rows
WHEN MATCHED THEN
    UPDATE SET	Code = Source.Code,
				Description = Source.Description

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Code,Description)
    VALUES (Source.Code,Source.Description)

--delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;

GO


-----------------------------------
----- GREEN Publication types -----
-----------------------------------
MERGE INTO [dbo].[Green.PublicationType] AS Target
USING
    (
        VALUES
        ('ANECDOTE', 'Anecdotes'),
        ('NEWS', 'News'),
        ('QUESTION', 'Questions')
    )
AS Source (Code, Description)
ON Target.Code = Source.Code

-- update matched rows
WHEN MATCHED THEN
    UPDATE SET	Code = Source.Code,
				Description = Source.Description

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Code,Description)
    VALUES (Source.Code,Source.Description)

--delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;

GO

-----------------------------------
----- COMMON Countries -----
-----------------------------------
MERGE INTO [dbo].[Common.Country] AS Target
USING
    (
        VALUES
        ('af', 'Afghanistan', 'Afghanistan'),
        ('al', 'Albania', 'Albanie'),
        ('dz', 'Algeria', 'Algérie'),
        ('ad', 'Andorra', 'Andorre'),
        ('ao', 'Angola', 'Angola'),
        ('ag', 'Antigua and Barbuda', 'Antigua-et-Barbuda'),
        ('ar', 'Argentina', 'Argentine'),
        ('am', 'Armenia', 'Arménie'),
        ('aw', 'Aruba', 'Aruba'),
        ('au', 'Australia', 'Australie'),
        ('at', 'Austria', 'Autriche'),
        ('az', 'Azerbaijan', 'Azerbaïdjan'),
        ('bs', 'Bahamas', 'Bahamas'),
        ('bh', 'Bahrain', 'Bahreïn'),
        ('bd', 'Bangladesh', 'Bangladesh'),
        ('bb', 'Barbados', 'Barbade'),
        ('by', 'Belarus', 'Bélarus'),
        ('be', 'Belgium', 'Belgique'),
        ('bz', 'Belize', 'Belize'),
        ('bj', 'Benin', 'Bénin'),
        ('bt', 'Bhutan', 'Bhoutan'),
        ('bo', 'Bolivia (Plurinational State of)', 'Bolivie'),
        ('ba', 'Bosnia and Herzegovina', 'Bosnie-Herzégovine'),
        ('br', 'Brazil', 'Brésil'),
        ('bn', 'Brunei Darussalam', 'Brunéi Darussalam'),
        ('bg', 'Bulgaria', 'Bulgarie'),
        ('bf', 'Burkina Faso', 'Burkina Faso'),
        ('cv', 'Cabo Verde', 'Cap-vert'),
        ('kh', 'Cambodia', 'Cambodge'),
        ('cm', 'Cameroon', 'Cameroun'),
        ('ca', 'Canada', 'Canada'),
        ('ky', 'Cayman Islands', 'Îles Caïmanes'),
        ('cf', 'Central African Republic', 'République Centrafricaine'),
        ('td', 'Chad', 'Tchad'),
        ('cl', 'Chile', 'Chili'),
        ('cn', 'China', 'Chine'),
        ('co', 'Colombia', 'Colombie'),
        ('cg', 'Congo', 'Congo (Brazzaville)'),
        ('cd', 'Congo, Democratic Republic of the', 'Rép. Dém. du Congo'),
        ('cr', 'Costa Rica', 'Costa Rica'),
        ('ci', 'Côte d''Ivoire', 'Côte d''Ivoire'),
        ('hr', 'Croatia', 'Croatie'),
        ('cu', 'Cuba', 'Cuba'),
        ('cw', 'Curaçao', 'Curaçao'),
        ('cy', 'Cyprus', 'Chypre'),
        ('cz', 'Czechia', 'République Tchèque'),
        ('dk', 'Denmark', 'Danemark'),
        ('dj', 'Djibouti', 'Djibouti'),
        ('dm', 'Dominica', 'Dominique'),
        ('do', 'Dominican Republic', 'République Dominicaine'),
        ('ec', 'Ecuador', 'Équateur'),
        ('eg', 'Egypt', 'Égypte'),
        ('sv', 'El Salvador', 'El Salvador'),
        ('gq', 'Equatorial Guinea', 'Guinée Équatoriale'),
        ('er', 'Eritrea', 'Érythrée'),
        ('ee', 'Estonia', 'Estonie'),
        ('sz', 'Eswatini', 'Eswatini'),
        ('et', 'Ethiopia', 'Éthiopie'),
        ('fo', 'Faeroe Islands', 'Îles Féroé'),
        ('fj', 'Fiji', 'Fidji'),
        ('fi', 'Finland', 'Finlande'),
        ('fr', 'France', 'France'),
        ('gf', 'French Guiana', 'Guyane Française'),
        ('pf', 'French Polynesia', 'Polynésie Française'),
        ('ga', 'Gabon', 'Gabon'),
        ('gm', 'Gambia', 'Gambie'),
        ('ge', 'Georgia', 'Géorgie'),
        ('de', 'Germany', 'Allemagne'),
        ('gh', 'Ghana', 'Ghana'),
        ('gi', 'Gibraltar', 'Gibraltar'),
        ('gr', 'Greece', 'Grèce'),
        ('gl', 'Greenland', 'Groenland'),
        ('gd', 'Grenada', 'Grenade'),
        ('gp', 'Guadeloupe', 'Guadeloupe'),
        ('gu', 'Guam', 'Guam'),
        ('gt', 'Guatemala', 'Guatemala'),
        ('gg', 'Guernsey', 'Guernsey'),
        ('gn', 'Guinea', 'Guinée'),
        ('gw', 'Guinea-Bissau', 'Guinée-Bissau'),
        ('gy', 'Guyana', 'Guyana'),
        ('ht', 'Haiti', 'Haïti'),
        ('hn', 'Honduras', 'Honduras'),
        ('hk', 'Hong-Kong', 'Hong-Kong'),
        ('hu', 'Hungary', 'Hongrie'),
        ('is', 'Iceland', 'Islande'),
        ('in', 'India', 'Inde'),
        ('id', 'Indonesia', 'Indonésie'),
        ('ir', 'Iran (Islamic Republic of)', 'Iran'),
        ('iq', 'Iraq', 'Iraq'),
        ('ie', 'Ireland', 'Irlande'),
        ('il', 'Israel', 'Israël'),
        ('it', 'Italy', 'Italie'),
        ('jm', 'Jamaica', 'Jamaïque'),
        ('jp', 'Japan', 'Japon'),
        ('je', 'Jersey', 'Jersey'),
        ('jo', 'Jordan', 'Jordanie'),
        ('kz', 'Kazakhstan', 'Kazakhstan'),
        ('ke', 'Kenya', 'Kenya'),
        ('kr', 'Korea, Republic of', 'Corée du Sud'),
        ('xk', 'Kosovo', 'Kosovo'),
        ('kw', 'Kuwait', 'Koweït'),
        ('kg', 'Kyrgyzstan', 'Kirghizistan'),
        ('la', 'Lao People''s Democratic Republic', 'Laos'),
        ('lv', 'Latvia', 'Lettonie'),
        ('lb', 'Lebanon', 'Liban'),
        ('lr', 'Liberia', 'Libéria'),
        ('ly', 'Libya', 'Libye'),
        ('li', 'Liechtenstein', 'Liechtenstein'),
        ('lt', 'Lithuania', 'Lituanie'),
        ('lu', 'Luxembourg', 'Luxembourg'),
        ('mo', 'Macao', 'Macao'),
        ('mg', 'Madagascar', 'Madagascar'),
        ('my', 'Malaysia', 'Malaisie'),
        ('mv', 'Maldives', 'Maldives'),
        ('ml', 'Mali', 'Mali'),
        ('mt', 'Malta', 'Malte'),
        ('mq', 'Martinique', 'Martinique'),
        ('mr', 'Mauritania', 'Mauritanie'),
        ('mu', 'Mauritius', 'Maurice'),
        ('yt', 'Mayotte', 'Mayotte'),
        ('mx', 'Mexico', 'Mexique'),
        ('-', 'Miscellaneous', 'Autres'),
        ('md', 'Moldova, Republic of', 'Moldavie'),
        ('mc', 'Monaco', 'Monaco'),
        ('mn', 'Mongolia', 'Mongolie'),
        ('me', 'Montenegro', 'Montenegro'),
        ('ma', 'Morocco', 'Maroc'),
        ('mz', 'Mozambique', 'Mozambique'),
        ('na', 'Namibia', 'Namibie'),
        ('np', 'Nepal', 'Népal'),
        ('nl', 'Netherlands', 'Pays-Bas'),
        ('nc', 'New Caledonia', 'Nouvelle-Calédonie'),
        ('nz', 'New Zealand', 'Nouvelle-Zélande'),
        ('ni', 'Nicaragua', 'Nicaragua'),
        ('ne', 'Niger', 'Niger'),
        ('ng', 'Nigeria', 'Nigéria'),
        ('mk', 'North Macedonia', 'Macédoine'),
        ('no', 'Norway', 'Norvège'),
        ('om', 'Oman', 'Oman'),
        ('pk', 'Pakistan', 'Pakistan'),
        ('ps', 'Palestine', 'Palestine'),
        ('pa', 'Panama', 'Panama'),
        ('pg', 'Papua New Guinea', 'Papouasie-Nouvelle-Guinée'),
        ('py', 'Paraguay', 'Paraguay'),
        ('pe', 'Peru', 'Pérou'),
        ('ph', 'Philippines', 'Philippines'),
        ('pl', 'Poland', 'Pologne'),
        ('pt', 'Portugal', 'Portugal'),
        ('pr', 'Puerto Rico', 'Porto Rico'),
        ('qa', 'Qatar', 'Qatar'),
        ('re', 'Reunion', 'Réunion'),
        ('ro', 'Romania', 'Roumanie'),
        ('ru', 'Russian Federation', 'Fédération de Russie'),
        ('rw', 'Rwanda', 'Rwanda'),
        ('bl', 'Saint Barthélemy', 'Saint Barthélemy*'),
        ('lc', 'Saint Lucia', 'Sainte-Lucie'),
        ('mf', 'Saint Martin', 'Saint Martin'),
        ('vc', 'Saint Vincent and the Grenadines', 'St-Vincent / Grenadines'),
        ('kl', 'Saint-Kitts-et-Nevis', 'Saint-Kitts-et-Nevis'),
        ('sm', 'San Marino', 'Saint-Marin'),
        ('sa', 'Saudi Arabia', 'Arabie Saoudite'),
        ('sn', 'Senegal', 'Sénégal'),
        ('rs', 'Serbia', 'Serbie'),
        ('sc', 'Seychelles', 'Seychelles'),
        ('sg', 'Singapore', 'Singapour'),
        ('sk', 'Slovakia', 'Slovaquie'),
        ('si', 'Slovenia', 'Slovénie'),
        ('so', 'Somalia', 'Somalie'),
        ('za', 'South Africa', 'Afrique du Sud'),
        ('es', 'Spain', 'Espagne'),
        ('lk', 'Sri Lanka', 'Sri Lanka'),
        ('sd', 'Sudan', 'Soudan'),
        ('sr', 'Suriname', 'Suriname'),
        ('se', 'Sweden', 'Suède'),
        ('ch', 'Switzerland', 'Suisse'),
        ('sy', 'Syrian Arab Republic', 'Syrie'),
        ('tw', 'Taiwan', 'Taïwan'),
        ('tz', 'Tanzania, United Republic of', 'Tanzanie'),
        ('th', 'Thailand', 'Thaïlande'),
        ('tl', 'Timor-Leste', 'Timor-Leste'),
        ('tg', 'Togo', 'Togo'),
        ('tt', 'Trinidad and Tobago', 'Trinité-et-Tobago'),
        ('tn', 'Tunisia', 'Tunisie'),
        ('tr', 'Turkey', 'Turquie'),
        ('ug', 'Uganda', 'Ouganda'),
        ('ua', 'Ukraine', 'Ukraine'),
        ('ae', 'United Arab Emirates', 'Émirats Arabes Unis'),
        ('gb', 'United Kingdom of Great Britain and Northern Ireland', 'Royaume-Uni'),
        ('us', 'United States of America', 'États-Unis'),
        ('uy', 'Uruguay', 'Uruguay'),
        ('uz', 'Uzbekistan', 'Ouzbékistan'),
        ('va', 'Vatican', 'Vatican'),
        ('ve', 'Venezuela (Bolivarian Republic of)', 'Venezuela'),
        ('vn', 'Viet Nam', 'Viet Nam'),
        ('zm', 'Zambia', 'Zambie'),
        ('zw', 'Zimbabwe', 'Zimbabwe')
    )
AS Source (Code, Name, FR_Name)
ON Target.Code = Source.Code

-- update matched rows
WHEN MATCHED THEN
    UPDATE SET	Code = Source.Code,
				Name = Source.Name,
				FR_Name = Source.FR_Name

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Code, Name, FR_Name)
    VALUES (Source.Code, Source.Name, Source.FR_Name)

--delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;

GO
