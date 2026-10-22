# School Database Design

## Table Explanations

- **students:** Stores core information about the people taking classes (id, name, and a unique email).
- **courses:** Stores the catalogue of available classes (id, title, description).
- **enrolments:** The join table that records when a specific student registers for a specific course, as well as holding data unique to that relationship (the student's grade).

## Relationships

The relationship between a Student and a Course is **Many-to-Many**. One student can take multiple courses, and one course can have multiple students. A relational database cannot store a list of values in a single column efficiently. Therefore, a **join table** (`enrolments`) is required. It breaks the many-to-many relationship into two **One-to-Many** relationships: a Student has many Enrolments, and a Course has many Enrolments.

## Suggested Index

I would add an index on `enrolments.course_id`. While primary keys and `UNIQUE` constraints (like the student email) are indexed automatically by the database engine, foreign keys often are not. Because we frequently query "which students are in this specific course" (Query 2), an index on `course_id` in the enrolments table would significantly speed up the `JOIN` operation when dealing with thousands of rows.

## SQL vs NoSQL

For a school management system, **SQL is the clear choice**. This data is highly structured with strict, predictable relationships. SQL's ACID compliance guarantees that data remains consistent (e.g., enforcing the foreign key constraints so an enrolment cannot exist for a deleted student, and enforcing the unique constraint so a student isn't double-enrolled). If we used a NoSQL Document database, we would have to embed arrays of students inside course documents (or vice versa), which creates massive data duplication and makes updating a student's name across all their courses unnecessarily difficult.
