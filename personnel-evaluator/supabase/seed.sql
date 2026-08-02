-- Run after schema.sql
insert into teams(name,season) select 'St Aloysius 7/8 Grade Football',2026 where not exists(select 1 from teams where name='St Aloysius 7/8 Grade Football' and season=2026);

with t as(select id from teams where name='St Aloysius 7/8 Grade Football' and season=2026 limit 1)
insert into coach_directory(team_id,name,role,email,is_admin)
select t.id,v.name,v.role,v.email,(v.role in('Head Coach','Offensive Coordinator')) from t,(values
('Bryan Greenwood','Head Coach','bryan.greenwood@att.net'),
('John Gahagan','Offensive Coordinator','johngahagan@yahoo.com'),
('Sal Christina','Defensive Backs','schristina@me.com'),
('Jerry Guillot','Special Teams','guillotj47@cox.net'),
('Ben Fontana','OL/DL','bfontana@capconla.com'),
('Brian Mautner','OL/DL','brian.mautner@gmail.com'),
('Josh Rivet','LB/DB','joshrivet@gmail.com'),
('Brady Foreman','Offense/Special Teams','272879foreman@catholichigh.org'),
('Steven Venturi','Coach','sventuri22@gmail.com'))v(name,role,email)
on conflict(email) do update set name=excluded.name,role=excluded.role;

with t as(select id from teams where name='St Aloysius 7/8 Grade Football' and season=2026 limit 1)
insert into players(team_id,name,jersey,grade,height,weight,off_position,off_secondary,def_position,def_secondary,pushups,squats,cone3,cone4,shuttle,notes,confirmation_status)
select t.id,v.* from t,(values
('Beau Berry','72','8th','5''7 3/4"',168,null,null,null,null,10,33,4.74,6.62,5.46,null,'confirmed'),
('Beau Fontana','19','7th','5''8 1/4"',151,'Tight end',null,'Line backer',null,16,42,null,null,null,'prior # was 4','confirmed'),
('Beckham Bourque','13','7th','5''4 1/2"',106,'Kicker','receiver','Cornerback',null,25,33,null,null,null,null,'confirmed'),
('Bennett Stone','95','7th','5''4"',126,'C','wherever I’m needed','DE','wherever I’m needed',40,38,4.04,5.75,5.93,null,'confirmed'),
('Bryce Casey',null,null,null,null,null,null,null,null,22,36,null,null,null,null,'confirmed'),
('Carter Verges','68','8th','5''8"',140,'Tackle',null,'Defense End',null,21,40,4.04,5.85,4.94,'prior # was 62','confirmed'),
('Graham Mickenheim','11','7th','5''5"',108,'Quarterback',null,'Safety',null,20,46,null,null,null,null,'confirmed'),
('Grayson Hiebert','0','8th','5''9 1/2"',130,'TE','WR, RB, FB','LB','DE',null,null,3.72,5.5,4.95,'DOB conflict — verify','confirmed'),
('Harrison Stone','12','8th','5''5 1/2"',108,'WR','QB, RB, TE','S','OLB, CB',16,55,3.77,5.68,5.1,'prior # was 80','confirmed'),
('Henry Ledet','33','7th','5''2 3/4"',100,'Running back',null,'Outside linebacker',null,38,50,null,null,null,null,'confirmed'),
('Henry Zaunbrecher',null,'7th','5''2"',138,null,null,null,null,20,65,null,null,null,null,'confirmed'),
('Jacob Freel','57','7th','5''5 1/2"',147,'Guard','Tackle','Tackle','End',10,35,null,null,null,null,'confirmed'),
('James Funderburk','18','8th',null,null,null,null,null,null,31,43,3.99,5.84,5.15,null,'confirmed'),
('James Mercier',null,'7th','5''8 1/4"',133,null,null,null,null,30,41,4.34,6.35,5.53,null,'confirmed'),
('Jesse Champion','54','7th','5''5"',165,'Offensive line','center, guard','Defensive tackle',null,null,null,null,null,null,null,'confirmed'),
('Landon Edwards','17','8th','5''9 1/2"',125,null,null,null,null,16,null,null,null,null,null,'confirmed'),
('Lane Wall','55','8th','5''7"',186,'Center',null,'D-Line or Linebacker',null,27,45,3.92,5.7,5.36,null,'confirmed'),
('Liam Cahill','56','7th','5''4 1/4"',119,'offensive tackle',null,'defensive linebacker',null,21,35,4.25,6.06,5.31,null,'confirmed'),
('Luke Ashton','2','8th','5''2"',111,'Wide Receiver',null,'Cornerback',null,35,52,3.74,5.39,4.95,'DOB conflict — verify','confirmed'),
('Mac Rivet','31','7th','5''8 3/4"',117,'wherever needed',null,'wherever needed',null,40,48,3.96,5.88,5.04,null,'confirmed'),
('Max Lambert','52','8th','5''5 1/2"',134,'Offensive Lineman',null,'Defensive Lineman',null,23,53,4.31,6.4,5.11,'DOB conflict — verify; prior # was 57','confirmed'),
('Max Mautner',null,'7th','5''5 1/2"',161,null,null,null,null,17,43,4.21,5.46,5.45,null,'confirmed'),
('Nolan Boyce','5','8th','5''9"',124,'WR',null,'Safety',null,30,41,3.7,5.23,4.79,null,'confirmed'),
('Parks Culotta','10','8th','5''2"',109,'Quarterback',null,'Safety',null,51,68,null,null,null,null,'confirmed'),
('Patrick Beckers','7','8th','5''9"',120,'Tight end',null,'Walk up safety',null,49,43,null,null,null,'prior # was 70','confirmed'),
('Ridgely Venturi',null,'7th','5''0"',78,null,null,null,null,30,57,3.71,5.6,5.21,null,'confirmed'),
('Sam Hebert','3','8th','5''5 1/2"',116,'RB',null,'LB',null,22,48,null,null,null,'prior # was 45','confirmed'),
('William Walton','32','7th','4''9 1/2"',72,'WR',null,'DB',null,30,40,null,null,null,null,'confirmed'),
('Wilton Town','4',null,null,null,null,null,null,null,22,41,null,null,4.86,'prior # was 21','confirmed'),
('Zach Trotter',null,'7th','5''6"',129,null,null,null,null,null,48,4.1,6.36,6.17,null,'confirmed'),
('Cole Brooks',null,'7th',null,null,null,null,null,null,null,null,null,null,null,null,'unconfirmed'),
('Landon Frazier',null,'7th',null,null,null,null,null,null,null,null,null,null,null,null,'unconfirmed'),
('Jacob Guilbeau',null,'7th',null,null,null,null,null,null,null,null,null,null,null,null,'unconfirmed'),
('Jack Lapointe','23','8th',null,null,null,null,null,null,null,null,null,null,null,null,'unconfirmed'),
('Parks McGucken',null,'8th',null,null,null,null,null,null,null,null,null,null,null,null,'unconfirmed'),
('Landry Roussel','22','8th',null,null,null,null,null,null,null,null,null,null,null,null,'unconfirmed'),
('Max Jones',null,null,null,null,null,null,null,null,null,null,3.84,5.37,4.99,null,'unconfirmed'))
v(name,jersey,grade,height,weight,off_position,off_secondary,def_position,def_secondary,pushups,squats,cone3,cone4,shuttle,notes,confirmation_status)
where not exists(select 1 from players p where p.team_id=t.id and p.name=v.name);

with t as(select id from teams where name='St Aloysius 7/8 Grade Football' and season=2026 limit 1)
insert into practices(team_id,practice_date,title) select t.id,current_date,'Current Practice' from t on conflict(team_id,practice_date) do nothing;
