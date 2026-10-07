
# College-Event-Management
# 🎓 College Event Management System

A full-stack web application for managing college events with role-based access control.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security 6 |
| Auth | JWT (jjwt 0.11.5) with HttpOnly Cookies |
| Database | MySQL 8, Spring Data JPA, Hibernate |
| Frontend | React 18, React Router DOM v6 |
| Styling | Tailwind CSS |
| HTTP Client | Axios (with credentials) |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Build Tool | Maven (backend), Vite (frontend) |

---

## 👥 Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Approve/reject events, manage users, view dashboard stats |
| **ORGANIZER** | Create, edit, delete own events, view attendees |
| **STUDENT** | Browse events, register/cancel registrations |

---

## ⚙️ Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+
- npm 9+

---

## 🗄️ Database Setup

Open MySQL and run:

```sql
CREATE DATABASE college_events;
```

That's it — tables are auto-created by Hibernate on first run.

---

## 🚀 Backend Setup

### 1. Navigate to backend folder
```bash
cd college-event-backend
```

### 2. Update database credentials
Open `src/main/resources/application.properties` and update:

```properties
spring.application.name=college-event-backend

# MySQL Database
spring.datasource.url=jdbc:mysql://localhost:3306/college_events?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOURpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret= eneter 32 digit alpanumericletet
jwt.expiration=time you want token to exprie

# Server
server.port=8080

# Cookie
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.same-site=Lax

# Logging
logging.level.org.springframework.security=DEBUG
logging.level.com.collegeevents=DEBUG


### 3. Run the backend
```bash
mvn spring-boot:run
```

Backend runs on → **http://localhost:8080**

> ✅ On first startup, an **Admin** account is auto-created:
> - Email: `admin@college.com`
> - Password: `admin123`

---

## 💻 Frontend Setup

### 1. Navigate to frontend folder
```bash
cd college-event-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the frontend
```bash
npm run dev
```

Frontend runs on → **http://localhost:5173**

---

## 🔐 API Endpoints

### Auth
```
POST   /api/auth/register       → Register (STUDENT or ORGANIZER)
POST   /api/auth/login          → Login (sets HttpOnly JWT cookie)
POST   /api/auth/logout         → Logout (clears cookie)
```

### Events
```
GET    /api/events              → All approved events (public)
GET    /api/events/my           → Organizer's own events
GET    /api/events/pending      → Pending events (ADMIN only)
POST   /api/events              → Create event (ORGANIZER)
PUT    /api/events/{id}         → Update event (ORGANIZER)
DELETE /api/events/{id}         → Delete event (ORGANIZER)
PUT    /api/events/{id}/approve → Approve event (ADMIN)
PUT    /api/events/{id}/reject  → Reject event (ADMIN)
```

### Registrations
```
POST   /api/registrations/{eventId}        → Register for event (STUDENT)
DELETE /api/registrations/{eventId}        → Cancel registration (STUDENT)
GET    /api/registrations/my               → My registrations (STUDENT)
GET    /api/registrations/event/{eventId}  → Event attendees (ADMIN/ORGANIZER)
```

### Admin
```
GET    /api/admin/dashboard         → Stats (total users, events, registrations)
GET    /api/admin/users             → All users
PUT    /api/admin/users/{id}/ban    → Ban/Unban user
```

---

## 🗂️ Project Structure

```
college-event-backend/
├── pom.xml
├── src/main/resources/
│   └── application.properties
└── src/main/java/com/collegeevents/
    ├── CollegeEventApplication.java
    ├── config/
    │   ├── SecurityConfig.java
    │   ├── JwtConfig.java          ← Admin user seeder
    │   └── CorsConfig.java
    ├── controller/
    │   ├── AuthController.java
    │   ├── EventController.java
    │   ├── RegistrationController.java
    │   └── AdminController.java
    ├── service/
    │   ├── AuthService.java
    │   ├── EventService.java
    │   ├── RegistrationService.java
    │   └── AdminService.java
    ├── repository/
    │   ├── UserRepository.java
    │   ├── EventRepository.java
    │   └── RegistrationRepository.java
    ├── model/
    │   ├── User.java
    │   ├── Event.java
    │   └── Registration.java
    ├── dto/
    │   ├── LoginRequest.java
    │   ├── RegisterRequest.java
    │   ├── EventRequest.java
    │   ├── EventResponse.java
    │   └── ApiResponse.java
    ├── security/
    │   ├── JwtUtil.java
    │   ├── JwtFilter.java
    │   └── UserDetailsServiceImpl.java
    └── exception/
        └── GlobalExceptionHandler.java

college-event-frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/
    │   └── axios.js
    ├── context/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx
    │   └── EventCard.jsx
    └── pages/
        ├── Login.jsx
        ├── Register.jsx
        ├── Home.jsx
        ├── student/
        │   ├── StudentDashboard.jsx
        │   └── MyRegistrations.jsx
        ├── organizer/
        │   ├── OrganizerDashboard.jsx
        │   ├── CreateEvent.jsx
        │   └── EventAttendees.jsx
        └── admin/
            ├── AdminDashboard.jsx
            ├── ManageUsers.jsx
            └── PendingEvents.jsx
```

---

## 🗃️ Database Schema

```sql
-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'ORGANIZER', 'STUDENT') NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at DATETIME
);

-- Events table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    venue VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    capacity INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    organizer_id BIGINT NOT NULL,
    created_at DATETIME,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- Registrations table
CREATE TABLE registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registered_at DATETIME,
    UNIQUE KEY unique_registration (student_id, event_id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);
```

> Tables are auto-created by Hibernate — no need to run this manually.

---

## 🔄 Application Flow

```
Student  → Register → Browse Events → Register for Event → View My Registrations
Organizer → Register → Create Event → Wait for Approval → View Attendees
Admin    → Login → Approve/Reject Events → Manage Users → View Dashboard
```

---

## 🌐 Default Routes

| URL | Page | Access |
|-----|------|--------|
| `/` | Home (All Events) | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/student/dashboard` | Student Dashboard | STUDENT |
| `/student/registrations` | My Registrations | STUDENT |
| `/organizer/dashboard` | Organizer Dashboard | ORGANIZER |
| `/organizer/create-event` | Create Event | ORGANIZER |
| `/organizer/attendees/:id` | Event Attendees | ORGANIZER |
| `/admin/dashboard` | Admin Dashboard | ADMIN |
| `/admin/users` | Manage Users | ADMIN |
| `/admin/pending-events` | Pending Events | ADMIN |

---

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.com | admin123 |
| Organizer | Register via `/register` | your choice |
| Student | Register via `/register` | your choice |

---

## ⚠️ Common Issues

**MySQL Connection Error**
→ Check `application.properties` — update username and password to match your MySQL setup.

**Port Already in Use**
→ Backend: Change `server.port` in `application.properties`
→ Frontend: Run `npm run dev -- --port 3000`

**CORS Error**
→ Make sure frontend is running on `http://localhost:5173` exactly (no trailing slash).

**JWT Cookie Not Sending**
→ All Axios calls use `withCredentials: true` — make sure you're not opening frontend on a different port than 5173.college Ip project in java springboot and React as frontend and MySQL as a backend
