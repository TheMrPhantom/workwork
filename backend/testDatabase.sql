CREATE TABLE member 
				(firstname TEXT, lastname TEXT, mail TEXT, password TEXT, rolle TEXT);
CREATE TABLE worktime 
				(memberID INTEGER, sportID INTEGER, description TEXT, minutes INTEGER, pending INTEGER);
CREATE TABLE sportMember
                (memberID INTEGER, sportID INTEGER, isTrainer INTEGER);
CREATE TABLE sport
                (name TEXT, extraHours INTEGER);

INSERT INTO worktime values (1, 1, 'Rasen mähen', 45, 0);
INSERT INTO worktime values (1, 1, 'Blumen gießen', 30, 1);
INSERT INTO worktime values (1, 2, 'Leiter streichen', 60, 0);
INSERT INTO worktime values (2, 1, 'Putzen', 120, 1);
INSERT INTO worktime values (2, 1, 'Kochen', 15, 0);
INSERT INTO worktime values (2, 3, 'Ausschank', 15, 0);
INSERT INTO worktime values (3, 3, 'Zeitstopper', 30, 1);
INSERT INTO worktime values (3, 3, 'Hundesitter', 45, 0);

INSERT INTO member values ("Bob", "Baumeister", "bob@baumeister.de", "lala", 0);
INSERT INTO member values ("alice", "wunderland", "alice@wunderland.de", "lulu", 0);
INSERT INTO member values ("eve", "evil", "eve@evil.de", "uu", 1);
INSERT INTO member values ("charly", "schokolade", "charly@schokolade.de", "ii", 0);

INSERT INTO sport values ("agility", 2);
INSERT INTO sport values ("rettungshunde", 0);
INSERT INTO sport values ("Turnierhunde", 1);

INSERT INTO sportMember values (1, 1, 1);
INSERT INTO sportMember values (1, 2, 0);
INSERT INTO sportMember values (2, 2, 0);
INSERT INTO sportMember values (3, 1, 0);
INSERT INTO sportMember values (3, 3, 0);
INSERT INTO sportMember values (4, 3, 0);