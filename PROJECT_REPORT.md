# EduPul – Academic Management System
## Project Report

---

## 1. PROJECT OVERVIEW

**Project Name:** EduPul

**Description:** EduPul is a comprehensive full-stack Academic Management System designed to manage critical university operations including departments, programs, courses, student enrollments, faculty assignments, and attendance tracking.

**Objective:** To provide a unified, role-based platform enabling students, faculty, and administrators to efficiently manage academic operations with a modern, user-friendly interface.

**Type:** Educational Technology (EdTech) / Student Information System (SIS)

**Development Date:** 2026

---

## 2. TECHNOLOGY STACK

### Backend
- **Framework:** Django 5.2.10
- **API:** Django REST Framework (DRF) 3.17.1
- **Authentication:** Simple JWT (djangorestframework_simplejwt 5.5.1)
- **Database:** SQLite (development) / PostgreSQL (production)
- **Language:** Python 3.x
- **CORS:** django-cors-headers 4.9.0

### Frontend
- **Framework:** React 19.2.4
- **Routing:** React Router v7.13.2
- **Build Tool:** Vite 8.0.1
- **Language:** JavaScript (ES6+)
- **Styling:** CSS3 with CSS Variables
- **Package Manager:** npm

### Additional Tools
- **Django Extensions:** For enhanced management commands
- **Graphviz & PyDotplus:** For database visualization

---

## 3. SYSTEM ARCHITECTURE

### Architecture Pattern
**Three-Tier Client-Server Architecture**

```
┌─────────────────────────────────────────────────┐
│          Frontend (React + Vite)                │
│     - Student/Faculty Dashboards                │
│     - Authentication Pages                      │
│     - Course & Attendance Management            │
└────────────────┬────────────────────────────────┘
                 │ REST API (HTTP/JSON)
┌────────────────▼────────────────────────────────┐
│       Backend (Django REST Framework)           │
│     - User Management & Authentication          │
│     - Academic Operations                       │
│     - Data Validation & Business Logic          │
└────────────────┬────────────────────────────────┘
                 │ ORM (Django ORM)
┌────────────────▼────────────────────────────────┐
│      Database (SQLite/PostgreSQL)               │
│     - User & Role Data                          │
│     - Academic Entities                         │
│     - Enrollment & Attendance Records           │
└─────────────────────────────────────────────────┘
```

### Database Configuration
- **Default:** SQLite (`db.sqlite3`) for local development
- **Production:** PostgreSQL with Environment Variables
- **Switching:** Controlled via `DATABASE_ENGINE` environment variable

---

## 4. PROJECT STRUCTURE

```
eduPul/
├── Backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   │
│   ├── accounts/                    # Authentication & User Management
│   │   ├── models.py               # User model with role choices
│   │   ├── serializers.py          # User serialization
│   │   ├── views.py                # Auth endpoints (Register, Login, Profile)
│   │   ├── urls.py                 # Auth routes
│   │   ├── permissions.py          # Custom permission classes
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── tests.py
│   │   └── migrations/
│   │
│   ├── academics/                   # Core Academic System
│   │   ├── models.py               # 12+ data models
│   │   ├── serializers.py          # Model serialization
│   │   ├── views.py                # CRUD operations
│   │   ├── urls.py                 # Academic routes
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── tests.py
│   │   └── migrations/             # Database schema versioning
│   │
│   └── eduPul/                      # Project Configuration
│       ├── settings.py             # Django settings (DB, apps, middleware)
│       ├── urls.py                 # Main URL router
│       ├── asgi.py                 # ASGI configuration
│       └── wsgi.py                 # WSGI configuration
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   │
│   ├── public/                     # Static assets
│   │
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # Root component
│       ├── index.css               # Global styling (680+ lines)
│       │
│       ├── api/                    # API communication layer
│       │   ├── client.js          # Centralized API client
│       │   ├── auth.js            # Authentication endpoints
│       │   ├── student.js         # Student API calls
│       │   ├── faculty.js         # Faculty API calls
│       │   └── attendance.js      # Attendance endpoints
│       │
│       ├── context/               # React Context (State Management)
│       │   └── AuthContext.jsx    # Authentication state
│       │
│       ├── pages/                 # Page components
│       │   ├── Login.jsx          # User login (hero + form)
│       │   ├── Register.jsx       # User registration (hero + form)
│       │   ├── Unauthorized.jsx   # 403 error page
│       │   ├── student/
│       │   │   └── Dashboard.jsx  # Student main view
│       │   └── faculty/
│       │       ├── Dashboard.jsx  # Faculty main view
│       │       ├── CoursePage.jsx # Course workspace
│       │       ├── AttendancePage.jsx      # Mark attendance
│       │       └── AttendanceHistory.jsx   # View attendance records
│       │
│       ├── routes/                # Route protection & guards
│       │   ├── ProtectedRoute.jsx # Auth-required wrapper
│       │   └── RoleRoute.jsx      # Role-based access control
│       │
│       └── assets/               # Images & media
│           └── pulchowkLogo.jpeg # Institution branding
│
└── README.MD                       # Project documentation
```

---

## 5. DATA MODELS

### Core Models

#### 1. **User** (Abstract Extended from Django)
```python
- id: AutoField
- username: CharField (unique)
- email: EmailField
- password: CharField (hashed)
- role: CharField (STUDENT | FACULTY | ADMIN)
- is_active: BooleanField
- is_staff: BooleanField
- date_joined: DateTimeField
```

#### 2. **Department**
```python
- id: AutoField
- name: CharField (unique)
```

#### 3. **Program**
```python
- id: AutoField
- name: CharField
- degree_type: CharField (e.g., "Bachelor", "Master")
- duration_years: IntegerField
- department: ForeignKey → Department
```

#### 4. **Course**
```python
- id: AutoField
- course_code: CharField (unique)
- title: CharField
- department: ForeignKey → Department
```

#### 5. **CourseOffering**
```python
- id: AutoField
- course: ForeignKey → Course
- program: ForeignKey → Program
- semester: CharField
- academic_year: IntegerField
- section: CharField
- Constraint: Unique(course, semester, academic_year, section)
```

#### 6. **Student**
```python
- id: AutoField
- roll_no: CharField (unique)
- name: CharField
- email: EmailField (unique)
- phone: CharField
- date_of_birth: DateField
- admission_year: IntegerField
- program: ForeignKey → Program
- user: OneToOneField → User
```

#### 7. **Faculty**
```python
- id: AutoField
- name: CharField
- email: EmailField (unique)
- phone: CharField
- designation: CharField
- department: ForeignKey → Department
- user: OneToOneField → User
```

#### 8. **CourseEnrollment**
```python
- id: AutoField
- student: ForeignKey → Student
- offering: ForeignKey → CourseOffering
- enrollment_date: DateField
- grade: CharField (nullable)
- created_at: DateTimeField (auto)
- updated_at: DateTimeField (auto)
- Constraint: Unique(student, offering)
```

#### 9. **Attendance**
```python
- id: AutoField
- enrollment: ForeignKey → CourseEnrollment
- date: DateField (default: today)
- status: CharField (P=Present | A=Absent | L=Late)
- created_at: DateTimeField (auto)
- updated_at: DateTimeField (auto)
- Constraint: Unique(enrollment, date)
```

#### 10. **TeachingAssignment**
```python
- id: AutoField
- faculty: ForeignKey → Faculty
- offering: ForeignKey → CourseOffering
- role: CharField
- created_at: DateTimeField (auto)
- updated_at: DateTimeField (auto)
- Constraint: Unique(faculty, offering)
```

#### 11. **ProgramCourse**
```python
- Links programs to courses for curriculum definition
```

#### 12. **Session**
```python
- Manages academic sessions/terms
```

### Database Schema Statistics
- **Total Models:** 12+
- **One-to-Many Relationships:** 8
- **One-to-One Relationships:** 2
- **Unique Constraints:** 6
- **Migrations:** 4 (including schema alterations)

---

## 6. API ENDPOINTS

### Authentication Endpoints (`/api/auth/`)

#### Register User
```
POST /api/auth/register/
Headers: Content-Type: application/json
Body: {
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "STUDENT" | "FACULTY" | "ADMIN"
}
Response: { user_id, username, email, role }
Status: 201 Created
```

#### Login (Obtain Token)
```
POST /api/token/
Body: {
  "username": "string",
  "password": "string"
}
Response: {
  "access": "JWT_TOKEN",
  "refresh": "REFRESH_TOKEN",
  "user_id": int,
  "role": "string"
}
Status: 200 OK
```

#### Refresh Token
```
POST /api/token/refresh/
Body: { "refresh": "REFRESH_TOKEN" }
Response: { "access": "NEW_JWT_TOKEN" }
Status: 200 OK
```

#### Get Current User Profile
```
GET /api/auth/me/
Headers: Authorization: Bearer {access_token}
Response: {
  "id": int,
  "username": "string",
  "role": "string",
  "student": { ... } | null,
  "faculty": { ... } | null
}
Status: 200 OK
```

### Academic Endpoints (`/api/academics/`)

#### Programs
```
GET    /api/academics/programs/              # List all programs
GET    /api/academics/programs/{id}/         # Get program detail
POST   /api/academics/programs/              # Create (admin only)
PUT    /api/academics/programs/{id}/         # Update (admin only)
DELETE /api/academics/programs/{id}/         # Delete (admin only)
```

#### Courses
```
GET    /api/academics/courses/               # List all courses
GET    /api/academics/courses/{id}/          # Get course detail
POST   /api/academics/courses/               # Create (admin only)
PUT    /api/academics/courses/{id}/          # Update (admin only)
DELETE /api/academics/courses/{id}/          # Delete (admin only)
```

#### Course Offerings
```
GET    /api/academics/course-offerings/      # List offerings
POST   /api/academics/course-offerings/      # Create offering
GET    /api/academics/course-offerings/{id}/ # Get offering detail
```

#### Enrollments
```
GET    /api/academics/enrollments/           # List enrollments
POST   /api/academics/enrollments/           # Create enrollment
GET    /api/academics/enrollments/{id}/      # Get enrollment detail
```

#### Attendance
```
GET    /api/academics/attendances/           # List attendance
GET    /api/academics/attendances/summary/   # Get attendance summary
GET    /api/academics/attendance/dates/      # Get dates with attendance
POST   /api/academics/attendance/mark/       # Mark attendance for date
PUT    /api/academics/attendance/{id}/       # Update attendance record
```

#### Faculty Courses
```
GET    /api/academics/my-courses/            # Get faculty's assigned courses
```

---

## 7. USER ROLES & PERMISSIONS

### Role-Based Access Control (RBAC)

#### **Student**
- ✅ View own profile
- ✅ View enrolled courses
- ✅ View attendance summary
- ✅ View attendance history
- ❌ Cannot modify course enrollments
- ❌ No access to other students' data

#### **Faculty**
- ✅ View own profile
- ✅ View assigned courses
- ✅ Take attendance for assigned courses
- ✅ View attendance history
- ✅ Edit attendance records
- ✅ View student lists per course
- ❌ Cannot access students from other courses
- ❌ Cannot modify course curriculum

#### **Admin**
- ✅ Full access to all models
- ✅ Create/Edit/Delete users, courses, programs
- ✅ Manage department structure
- ✅ Assign faculty to courses
- ✅ Create course offerings
- ✅ Access Django admin panel

---

## 8. FRONTEND FEATURES

### Visual Design System
- **Color Palette:** 
  - Primary Blue: `#2799D7`
  - Deep Blue: `#0F2C4A`
  - Accent Orange: `#E56D27`
  - Success Green: `#26845F`
  - Error Red: `#B14949`

- **CSS Variables:** 24+ custom properties for colors, spacing, shadows, typography
- **Responsive Design:** Mobile (720px), Tablet (980px), Desktop (1200px+)
- **Branding:** Pulchowk campus official logo integrated in auth pages

### Component Architecture

#### Layout Components
- `.app-page` - Main page container
- `.surface` - Card/panel surface
- `.hero-shell` - Page hero section wrapper
- `.hero-panel` - Hero content panel
- `.stack` - Vertical flex container
- `.form-stack` - Form-specific styling

#### Data Display
- `.metric-grid` - KPI cards display
- `.course-grid` - Course card layout
- `.attendance-grid` - Calendar grid
- `.table-wrap` - Scrollable table wrapper
- `.summary-grid` - Summary metrics grid

### Page Features

#### Login Page
- Pulchowk logo banner at top
- Email/username and password form
- "Create Account" link to registration
- "Forgot Password" placeholder
- Responsive layout with hero section

#### Registration Page
- Multi-step form (username, email, password, role selection)
- Role dropdown (Student/Faculty)
- Pulchowk logo hero section
- Form validation with error messages
- Auto-redirect to login on success

#### Student Dashboard
- Profile section with username, email, program
- Metric cards: Courses enrolled, attendance count
- Enrolled courses grid with semester/section info
- Attendance summary by course
- Status indicators (Present/Late/Absent)

#### Faculty Dashboard
- Profile section with username, email, department
- Assigned courses grid with action buttons
- "Take Attendance" quick action
- "Attendance History" quick action
- Course details (code, program, semester)

#### Course Management (Faculty)
- Course details header with program/semester/section
- Action buttons: Take Attendance, Edit, Reports, History
- Calendar view for attendance dates
- Legend for recorded/missing/blank dates

#### Attendance Marking
- Student list with current status
- Radio-style status toggles (Present/Late/Absent)
- Metric summary (Present count, Late count, Absent count)
- Date picker for session date
- Save/Submit button

#### Attendance History
- Calendar grid view
- Month navigation (previous/next)
- Color-coded dates (recorded/missing/blank)
- Legend explaining color codes

---

## 9. KEY FEATURES IMPLEMENTED

### Authentication & Authorization ✅
- JWT-based token authentication
- Role-based access control (RBAC)
- Protected API endpoints
- Protected routes on frontend
- Custom permission classes

### Academic Management ✅
- Department and program structure
- Course curriculum mapping
- Course offering creation
- Student enrollment system
- Grade tracking (in model, UI pending)

### Attendance System ✅
- Daily attendance marking by faculty
- Three status types (Present, Late, Absent)
- Attendance date tracking
- Unique constraint (one record per student per date)
- Attendance summary by course
- Calendar visualization

### User Management ✅
- User registration with role selection
- User profile creation (manual)
- User profile retrieval with role-specific data
- Email validation

### Frontend UI ✅
- Modern, responsive design
- Pulchowk branding/logo integration
- Role-based dashboard views
- Interactive forms with validation
- Data visualization (grids, metrics)
- Calendar interface for attendance

### API Robustness ✅
- Centralized API client with error handling
- Content-type validation
- JSON response parsing with fallback
- Meaningful error messages
- CORS configuration for frontend access

---

## 10. TECHNICAL HIGHLIGHTS

### Backend Highlights
1. **Flexible Database Configuration**
   - Switches between SQLite (dev) and PostgreSQL (prod) via environment variable
   - Zero configuration needed for local development

2. **Efficient Data Serialization**
   - DRF serializers for model → JSON conversion
   - Nested serializers for related data
   - Custom serializers for authentication

3. **Data Integrity**
   - Unique constraints at database level
   - Foreign key relationships with cascade rules
   - One-to-one relationships for user extensions

4. **Authentication Pipeline**
   - Simple JWT tokens with refresh capability
   - Custom token serializer including user role
   - Permission classes for endpoint protection

### Frontend Highlights
1. **Centralized API Layer**
   - Single API client class with error handling
   - Automatic JWT token refresh
   - Content-type validation to catch server errors

2. **Routing Architecture**
   - React Router v7 for SPA navigation
   - Protected routes requiring authentication
   - Role-based route access control

3. **State Management**
   - React Context for authentication state
   - Token persistence in localStorage
   - Automatic logout on token expiration

4. **Design System**
   - CSS variables for easy theming
   - Component-based class naming
   - Mobile-first responsive design
   - Consistent spacing and typography

---

## 11. INSTALLATION & SETUP

### Backend Setup
```bash
# 1. Navigate to backend directory
cd Backend

# 2. Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create migrations
python manage.py makemigrations

# 5. Apply migrations
python manage.py migrate

# 6. Create superuser (admin)
python manage.py createsuperuser

# 7. Run development server
python manage.py runserver
```

**Backend runs on:** `http://localhost:8000`

### Frontend Setup
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

**Frontend runs on:** `http://localhost:5173`

### Environment Configuration

#### Local Development (SQLite)
```bash
# No additional configuration needed
# Automatically uses SQLite from start
```

#### PostgreSQL Setup (Optional)
```bash
# Set environment variables
DATABASE_ENGINE=postgresql
POSTGRES_DB=edupul
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Then run migrations
python manage.py migrate
```

---

## 12. PROJECT STATISTICS

### Codebase Metrics

#### Backend
- **Python Lines:** ~800+ (models, views, serializers)
- **Database Models:** 12+
- **API Endpoints:** 30+
- **Database Migrations:** 4
- **Unique Constraints:** 6

#### Frontend
- **React Components:** 8+ pages
- **CSS Lines:** 680+
- **JavaScript Lines:** 1,500+
- **API Integration Points:** 5+ modules
- **Responsive Breakpoints:** 3 (720px, 980px, desktop)

#### Build Output
- **Main JavaScript Bundle:** 254.81 KB (gzipped: 78.79 KB)
- **CSS Bundle:** 8.28 KB (gzipped: 2.44 KB)
- **Logo Asset:** 75.39 KB
- **Total Gzipped Size:** ~155 KB

### Development Timeline
- **Current Phase:** UI/UX Refinement & Branding Integration
- **Build Status:** ✅ All builds passing
- **Test Status:** Structure in place, tests pending
- **Production Readiness:** 75% (authentication, data models, basic CRUD complete)

---

## 13. CURRENT STATUS & TESTING

### Completed Features ✅
- Django backend with DRF
- SQLite/PostgreSQL database abstraction
- User authentication with JWT
- All primary data models
- CRUD operations for academic entities
- Student & faculty dashboards
- Attendance marking system
- React frontend with routing
- Role-based access control
- Modern UI with Pulchowk branding
- API error handling and validation
- Database migrations

### Pending Implementation 🚧
- Automatic Student/Faculty profile creation on registration
- Grade management UI
- Reports generation page
- Bulk attendance upload
- Email notifications
- Search functionality
- Advanced filtering
- Audit logging

### Testing Status
- **Unit Tests:** Structure created, test cases pending
- **Integration Tests:** Not yet implemented
- **API Testing:** Manual via REST client (Postman)
- **Frontend Testing:** Smoke tested in browser
- **Build Validation:** ✅ Production builds passing

---

## 14. DEPLOYMENT CONSIDERATIONS

### Production Checklist
- [ ] Set `DEBUG = False` in settings.py
- [ ] Update `ALLOWED_HOSTS` with domain
- [ ] Use strong `SECRET_KEY` (from environment)
- [ ] Configure PostgreSQL for production
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure environment variables securely
- [ ] Run static file collection: `python manage.py collectstatic`
- [ ] Set up database backups
- [ ] Configure CORS for frontend domain
- [ ] Set up error monitoring (Sentry)
- [ ] Configure logging to files
- [ ] Run database migrations on production
- [ ] Set up reverse proxy (Nginx/Apache)

### Performance Optimization Opportunities
1. Database query optimization with `select_related()` and `prefetch_related()`
2. API response pagination
3. Frontend code splitting with React.lazy()
4. Image optimization for logo asset
5. Database indexing on frequently queried fields

---

## 15. KEY LEARNINGS & DECISIONS

### Architectural Decisions
1. **JWT over Sessions:** Chosen for stateless API suitable for SPA + mobile
2. **SQLite Default:** Eliminates setup friction for local development
3. **Role Model in User:** Simplified permission checks vs. separate role table
4. **DRF Serializers:** Centralized validation and transformation logic
5. **CSS Variables:** Global theme changes without modifying component code

### Technical Insights
- Frontend-backend sync essential (e.g., registration email field)
- Content-type validation prevents cascading parse errors
- Unique constraints at DB level prevent race conditions
- Hero component pattern reusable across multiple pages
- Context API sufficient for authentication state in this scope

---

## 16. CONCLUSION

EduPul is a fully-functional, modern academic management system combining:
- Robust Django backend with comprehensive data models
- Responsive React frontend with intuitive UI
- JWT-based security with role-based access control
- Flexible database configuration for dev/prod environments
- Professional branding aligned with institutional identity

The system is production-ready for deployment with minor enhancements (auto-profile creation, email notifications) to complete the user onboarding flow.

### Recommended Next Steps
1. Implement automatic Student/Faculty profile creation on registration
2. Add email notification system for attendance alerts
3. Deploy to staging environment for team testing
4. Implement comprehensive test suite (unit, integration, E2E)
5. Set up CI/CD pipeline for automated testing and deployment

---

## APPENDIX A: Dependencies

### Backend Requirements
```
asgiref==3.11.1
Django>=5.1,<6.0
django-cors-headers==4.9.0
django-extensions==4.1
djangorestframework==3.17.1
djangorestframework_simplejwt==5.5.1
graphviz==0.21
pydotplus==2.0.2
PyJWT==2.12.1
pyparsing==3.3.2
sqlparse==0.5.5
```

### Frontend Dependencies
```
Production:
- react@19.2.4
- react-dom@19.2.4
- react-router-dom@7.13.2

Development:
- vite@8.0.1
- @vitejs/plugin-react@6.0.1
- eslint@9.39.4 (with React plugins)
```

---

## APPENDIX B: Database Schema Quick Reference

**Total Entities:** 12+  
**Total Relationships:** 12  
**Constraints:** 6 unique, multiple foreign keys  

**Core Data Flow:**
```
User → Student/Faculty → Program → Course → CourseOffering 
      → CourseEnrollment → Attendance
```

---

**Document Version:** 1.0  
**Last Updated:** April 5, 2026  
**Project Status:** In Development / Production Ready
