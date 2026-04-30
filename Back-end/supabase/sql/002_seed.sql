insert into classes (id, grade, name, label) values
('9-a','Grade 9','A','Grade 9 - A'),
('9-b','Grade 9','B','Grade 9 - B'),
('10-a','Grade 10','A','Grade 10 - A'),
('10-b','Grade 10','B','Grade 10 - B'),
('11-a','Grade 11','A','Grade 11 - A'),
('11-b','Grade 11','B','Grade 11 - B'),
('12-a','Grade 12','A','Grade 12 - A'),
('12-b','Grade 12','B','Grade 12 - B')
on conflict (id) do update set grade = excluded.grade, name = excluded.name, label = excluded.label;

insert into teachers (id, name, subject, grade, email, phone) values
('t-1','Mr. Silva','Mathematics','Grade 11','silva@siyowin.edu','+94 77 123 4567'),
('t-2','Ms. Fernando','Science','Grade 11','fernando@siyowin.edu','+94 77 234 5678')
on conflict (id) do update set name = excluded.name, subject = excluded.subject, grade = excluded.grade, email = excluded.email, phone = excluded.phone;

insert into students (id, name, index, grade, class_id, parent_name, parent_phone) values
('st-1','Alex Johnson','2026-11-012','Grade 11','11-a','Mary Johnson','+94 77 111 2222'),
('st-2','Sara Perera','2026-11-045','Grade 11','11-a',null,null),
('st-3','Nimal Fernando','2026-10-018','Grade 10','10-b',null,null),
('st-4','Sara Perera','2026-12-003','Grade 12','12-a',null,null)
on conflict (id) do update set name = excluded.name, index = excluded.index, grade = excluded.grade, class_id = excluded.class_id, parent_name = excluded.parent_name, parent_phone = excluded.parent_phone;

insert into app_users (id, name, email, role, student_id, teacher_id, password_hash) values
('user-student-1','Alex Johnson','student@siyowin.lk','student','st-1',null,'$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C'),
('user-teacher-1','Mr. Silva','teacher@siyowin.lk','teacher',null,'t-1','$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C'),
('user-admin-1','Admin User','admin@siyowin.lk','admin',null,null,'$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C'),
('user-super-admin-1','Super Admin','superadmin@siyowin.lk','super-admin',null,null,'$2a$10$L1DRsQP2W.9.VcIAvBa4HuHVc4DLYx7vUtBsOQ0h1qHhJKLNVdh8C')
on conflict (id) do update set name = excluded.name, email = excluded.email, role = excluded.role, student_id = excluded.student_id, teacher_id = excluded.teacher_id, password_hash = excluded.password_hash;

insert into subjects (id, name, emoji, color, teacher, class_label, rank, trend, current_mark, class_avg, next_exam, term_test, day_paper, month_test, homework_done_this_month, homework_target_this_month, display_order) values
('math','Mathematics','M','#D9232D','Mr. Silva','Grade 11 - Mathematics',2,'up',91,74,'May 12',92,89,90,11,12,1),
('sci','Science','S','#F47920','Ms. Fernando','Grade 11 - Science',5,'up',84,71,'May 14',83,80,85,9,11,2),
('eng','English','E','#1B3A8C','Mrs. Perera','Grade 11 - English',12,'neutral',78,76,'May 10',77,79,78,8,10,3),
('hist','History','H','#c0392b','Mr. Gunasena','Grade 11 - History',1,'up',95,68,'May 18',94,96,95,10,10,4),
('geo','Geography','G','#e67e22','Ms. Jayawardena','Grade 11 - Geography',18,'down',72,73,'May 16',73,71,72,7,10,5),
('cs','Computer Science','C','#2c55c7','Mr. Bandara','Grade 11 - Computer Science',1,'up',98,69,'May 20',99,97,98,12,12,6)
on conflict (id) do update set name = excluded.name, emoji = excluded.emoji, color = excluded.color, teacher = excluded.teacher, class_label = excluded.class_label, rank = excluded.rank, trend = excluded.trend, current_mark = excluded.current_mark, class_avg = excluded.class_avg, next_exam = excluded.next_exam, term_test = excluded.term_test, day_paper = excluded.day_paper, month_test = excluded.month_test, homework_done_this_month = excluded.homework_done_this_month, homework_target_this_month = excluded.homework_target_this_month, display_order = excluded.display_order;

truncate table subject_history restart identity;
insert into subject_history (subject_id, label, date, mark, note, display_order) values
('math','Unit Test 4','Apr 24',91,'Strong algebra section',1),('math','Monthly Test','Apr 14',89,'Top 3 in class',2),('math','Day Paper','Mar 29',93,'Fast and accurate',3),('math','Term Test 2','Mar 18',88,'Excellent geometry',4),('math','Quiz','Mar 04',90,'Completed early',5),
('sci','Practical Test','Apr 23',84,'Lab work was accurate',1),('sci','Monthly Test','Apr 11',81,'Good improvement',2),('sci','Day Paper','Mar 28',82,'Good pacing',3),('sci','Term Test 2','Mar 16',79,'Needs more revision',4),('sci','Quiz','Mar 05',86,'Strong recall',5),
('eng','Essay Check','Apr 22',78,'Clear structure',1),('eng','Monthly Test','Apr 12',76,'Close to class average',2),('eng','Day Paper','Mar 30',79,'Good vocabulary use',3),('eng','Term Test 2','Mar 17',77,'Solid reading score',4),('eng','Spelling Quiz','Mar 03',80,'Very accurate',5),
('hist','Term Test 2','Apr 25',95,'Best in class',1),('hist','Monthly Test','Apr 13',94,'Excellent analysis',2),('hist','Day Paper','Mar 31',96,'Very detailed answers',3),('hist','Quiz','Mar 19',92,'Strong recall of events',4),('hist','Source Question','Mar 06',95,'Well reasoned',5),
('geo','Map Test','Apr 21',72,'Good map reading',1),('geo','Monthly Test','Apr 10',71,'Needs more revision',2),('geo','Day Paper','Mar 27',73,'Answer length improved',3),('geo','Term Test 2','Mar 15',74,'Better structure',4),('geo','Quiz','Mar 02',70,'Revision required',5),
('cs','Coding Challenge','Apr 26',98,'Clean solution',1),('cs','Monthly Test','Apr 15',99,'Perfect logic flow',2),('cs','Day Paper','Mar 28',97,'Fast and accurate',3),('cs','Term Test 2','Mar 17',98,'Strong debugging',4),('cs','Quiz','Mar 05',100,'No mistakes',5);

truncate table homeworks;
insert into homeworks (id, student_id, subject_id, title, due_date, completed_date, status, display_order) values
('math-hw-1','st-1','math','Trigonometry mixed exercises','Apr 28','Apr 27','completed',1),('math-hw-2','st-1','math','Algebra factorization worksheet','Apr 24','Apr 24','completed',2),('math-hw-3','st-1','math','Geometry theorem practice','Apr 20','Apr 19','completed',3),('math-hw-4','st-1','math','Monthly paper corrections','Apr 16','Apr 16','completed',4),('math-hw-5','st-1','math','Probability short questions','Apr 12',null,'pending',5),
('sci-hw-1','st-1','sci','Osmosis lab report','Apr 29','Apr 28','completed',1),('sci-hw-2','st-1','sci','Chemical reactions notes','Apr 25','Apr 25','completed',2),('sci-hw-3','st-1','sci','Electricity revision questions','Apr 22','Apr 21','completed',3),('sci-hw-4','st-1','sci','Human eye diagram labels','Apr 18',null,'pending',4),('sci-hw-5','st-1','sci','Force and motion worksheet','Apr 14','Apr 14','completed',5),
('eng-hw-1','st-1','eng','Essay: Climate change solutions','Apr 30','Apr 29','completed',1),('eng-hw-2','st-1','eng','Reading comprehension passage','Apr 26','Apr 26','completed',2),('eng-hw-3','st-1','eng','Vocabulary list sentences','Apr 22',null,'pending',3),('eng-hw-4','st-1','eng','Grammar correction exercise','Apr 18','Apr 18','completed',4),('eng-hw-5','st-1','eng','Speech draft outline','Apr 13','Apr 12','completed',5),
('hist-hw-1','st-1','hist','World War II timeline project','May 2','Apr 30','completed',1),('hist-hw-2','st-1','hist','Ancient kingdoms source notes','Apr 27','Apr 27','completed',2),('hist-hw-3','st-1','hist','Map marking activity','Apr 23','Apr 22','completed',3),('hist-hw-4','st-1','hist','Short answers: independence era','Apr 19','Apr 19','completed',4),('hist-hw-5','st-1','hist','Term test corrections','Apr 15','Apr 15','completed',5),
('geo-hw-1','st-1','geo','South-East Asia map activity','May 3',null,'pending',1),('geo-hw-2','st-1','geo','Climate zones worksheet','Apr 28','Apr 28','completed',2),('geo-hw-3','st-1','geo','River systems short notes','Apr 24',null,'pending',3),('geo-hw-4','st-1','geo','Population pyramid practice','Apr 20','Apr 20','completed',4),('geo-hw-5','st-1','geo','Map symbols revision','Apr 16','Apr 15','completed',5),
('cs-hw-1','st-1','cs','Build a simple sorting algorithm','May 5','Apr 30','completed',1),('cs-hw-2','st-1','cs','Flowchart for login process','Apr 27','Apr 26','completed',2),('cs-hw-3','st-1','cs','Debugging practice sheet','Apr 23','Apr 23','completed',3),('cs-hw-4','st-1','cs','Database table design','Apr 19','Apr 18','completed',4),('cs-hw-5','st-1','cs','Binary conversion exercise','Apr 15','Apr 15','completed',5);

truncate table leaderboards restart identity;
insert into leaderboards (subject_id, rank, name, marks, avatar, badge, is_you) values
('math',1,'Priya Sharma',97,'P','gold',false),('math',2,'Daniel Kim',94,'D','silver',false),('math',3,'Alex Johnson',91,'A','bronze',true),('math',4,'Sarah Chen',88,'S',null,false),('math',5,'Marco Rivera',85,'M',null,false),
('sci',1,'Daniel Kim',96,'D','gold',false),('sci',2,'Priya Sharma',92,'P','silver',false),('sci',3,'Alex Johnson',89,'A',null,true),('sci',4,'Yuki Tanaka',86,'Y',null,false),('sci',5,'Omar Hassan',82,'O',null,false),
('eng',1,'Alex Johnson',93,'A','gold',true),('eng',2,'Priya Sharma',90,'P','silver',false),('eng',3,'Daniel Kim',88,'D','bronze',false);

insert into marks (student_id, subject_id, subject_name, exam_type, exam_name, exam_date, mark, note) values
('st-1','math','Mathematics','term-test','Term Test 2','2026-05-14',91,'Strong algebra'),
('st-1','eng','English','month-test','May Benchmark','2026-05-15',78,'Good structure'),
('st-2','eng','English','term-test','Term Test 2','2026-05-14',78,'Clear writing'),
('st-3','sci','Science','month-test','May Benchmark','2026-05-16',84,'Improved lab work'),
('st-4','hist','History','term-test','Term Test 2','2026-05-18',87,'Excellent recall')
on conflict (student_id, subject_id, exam_type, exam_name) do update set subject_name = excluded.subject_name, exam_date = excluded.exam_date, mark = excluded.mark, note = excluded.note;
