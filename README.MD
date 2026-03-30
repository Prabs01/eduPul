# EduPul – Academic Management System 

EduPul is a Django-based Academic Management System backend designed to manage core university operations such as departments, programs, courses, enrollments, attendance, and faculty assignments.

## Project Structure

eduPul/
- ├── accounts/ # Authentication & user roles
- ├── academics/ # Core academic system
- ├── eduPul/ # Project settings
- ├── manage.py

## User Roles

The system is built around role-based access:

- Student
- Faculty
- Admin


---
##  Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/edupul.git
cd edupul
```
### 2. Create virtual environment
```bash
python -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies
```bash 
pip install -r requirements.txt
```

### 4. Run migrations
```bash 
python manage.py makemigrations
python manage.py migrate
```

### 5. Run server
```bash
python manage.py runserver
```
