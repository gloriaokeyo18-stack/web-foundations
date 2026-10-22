-- ==========================================
-- 1. CREATE TABLES
-- ==========================================

CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT
);

CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(student_id, course_id) -- Prevents a student from enrolling in the same course twice
);

-- ==========================================
-- 2. INSERT SAMPLE DATA
-- ==========================================

-- Insert 4 students (so we can leave one with zero enrolments to test Query 4)
INSERT INTO students (name, email) VALUES 
('Alice Johnson', 'alice@example.com'),
('Bob Smith', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com'),
('Diana Prince', 'diana@example.com');

-- Insert 3 courses
INSERT INTO courses (title, description) VALUES 
('Web Development', 'Learn HTML, CSS, and JS'),
('Database Design', 'Learn SQL and data modeling'),
('Data Science', 'Learn Python and statistics');

-- Insert 5 enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'B'), -- Alice takes Web Dev
(1, 2, 'A'), -- Alice takes Database Design
(2, 1, 'C'), -- Bob takes Web Dev
(3, 2, 'B'), -- Charlie takes Database Design
(3, 3, 'A'); -- Charlie takes Data Science
-- Diana is left with 0 enrolments

-- ==========================================
-- 3. THE FIVE QUERIES
-- ==========================================

-- Query 1: All courses for one student (by name)
SELECT courses.title, enrolments.grade
FROM courses
JOIN enrolments ON courses.id = enrolments.course_id
JOIN students ON students.id = enrolments.student_id
WHERE students.name = 'Alice Johnson';

-- Query 2: All students on one course
SELECT students.name, students.email
FROM students
JOIN enrolments ON students.id = enrolments.student_id
JOIN courses ON courses.id = enrolments.course_id
WHERE courses.title = 'Web Development';

-- Query 3: The number of students per course
SELECT courses.title, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON courses.id = enrolments.course_id
GROUP BY courses.title;

-- Query 4: Students who have no enrolments
SELECT students.name 
FROM students
LEFT JOIN enrolments ON students.id = enrolments.student_id
WHERE enrolments.id IS NULL;

-- Query 5: Update of one enrolment's grade
UPDATE enrolments 
SET grade = 'A+' 
WHERE student_id = 1 AND course_id = 1;