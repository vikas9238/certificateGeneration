# Certificate Management System

A Node.js/Express/MongoDB application for managing students, courses, enrolments, and generating course completion certificates as PDFs.

---

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
  - [Student APIs](#student-apis)
  - [Course APIs](#course-apis)
  - [Enrolment APIs](#enrolment-apis)
  - [Certificate APIs](#certificate-apis)
- [PDF Certificate Generation](#pdf-certificate-generation)
- [Project Structure](#project-structure)

---

## Features

- Student registration, email verification, and management
- Course creation and management
- Student enrolment in courses
- Certificate generation with PDF download

---

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/vikas9238/certificateGeneration.git
   cd certificateGeneration
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**  
   Create a `.env` file with your MongoDB URI and other configs.

4. **Run the server:**
   ```sh
   npm start
   ```

---

## API Endpoints

### Student APIs

| Method | Endpoint                      | Description                   |
| ------ | ----------------------------- | ----------------------------- |
| POST   | `/api/students/register`      | Register a new student        |
| GET    | `/api/students/verify/:token` | Verify student email by token |
| GET    | `/api/students/list`          | Get all students              |
| GET    | `/api/students/:id`           | Get student details by ID     |
| PUT    | `/api/students/:id`           | Update student details        |
| DELETE | `/api/students/:id`           | Delete a student              |
| POST   | `/api/students/resend-email`  | Resend email verification     |

#### Example: Register Student

```http
POST /api/students/register
Content-Type: application/json

{
  "name": "Vikas Kumar",
  "email": "vikas@email.com",
  "mobile": "9876543210"
}
```

---

### Course APIs

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | `/api/course/add`  | Create a new course   |
| GET    | `/api/course/list` | Get all courses       |
| GET    | `/api/course/:id`  | Get course details    |
| PUT    | `/api/course/:id`  | Update course details |

---

### Enrolment APIs

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| POST   | `/api/enrolment/add`       | Enrol a student in a course     |
| GET    | `/api/enrolment/list`      | Get all enrolment details       |
| GET    | `/api/enrolment/:id`       | Get enrolment details           |
| PUT    | `/api/enrolment/:id`       | Update enrolment details        |
| GET    | `/api/enrolment/:courseId` | Get particular course enrolment |

---

### Certificate APIs

| Method | Endpoint                         | Description                                 |
| ------ | -------------------------------- | ------------------------------------------- |
| POST   | `/api/certificates/generate`     | Generate a certificate for a student/course |
| GET    | `/api/certificates/:id`          | Get certificate details by ID               |
| GET    | `/api/certificates/download/:id` | Download certificate PDF by ID              |
| GET    | `/api/certificates/list`         | List all certificates                       |

#### Example: Generate Certificate

```http
POST /api/certificates/generate
Content-Type: application/json

{
  "studentId": "student-uuid",
  "courseId": "course-uuid"
}
```

---

## PDF Certificate Generation

- When a certificate is generated, a PDF is created using a background template and dynamic content (student name, course name, date, etc.).
- The PDF is saved in the `/certificates` directory and can be downloaded via the `/api/certificates/download/:id` endpoint.

---

## Project Structure

```
/src
  /controllers      # API logic for students, courses, enrolments, certificates
  /models           # Mongoose schemas
  /routes           # Express route definitions
  /middlewares      # Validation and error handling
  /utils            # Helper functions and classes
  /certificates     # Generated certificate PDFs and templates
Readme.md
```

---

## Notes

- All endpoints return JSON responses.
- Validation and error handling are implemented for all major operations.
- PDF generation uses [PDFKit](https://pdfkit.org/).
- Email verification is required for certificate generation.

---
