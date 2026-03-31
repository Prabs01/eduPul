# EduPul – Academic Management System 

EduPul is a full-stack Academic Management System designed to manage university operations such as departments, programs, courses, enrollments, attendance, and faculty assignments.

It consists of:
- **Backend:** Django REST Framework API
- **Frontend:** React (Vite)

## Project Structure

```plaintext id="proj_structure_001"
eduPul/
├── Backend/
│   ├── accounts/      # Authentication & user roles
│   ├── academics/     # Core academic system
│   ├── eduPul/        # Project settings
│   ├── manage.py
│
├── frontend/          # React (Vite) app
│   ├── src/
│   ├── index.html
│   ├── package.json
```

## User Roles

The system is built around role-based access:

- Student
- Faculty
- Admin


---
##  Backend Setup (Django)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/edupul.git
cd edupul/Backend
```
### 2. Create virtual environment
```bash
python -m venv .venv
source .venv/bin/activate   # Mac/Linux
.venv\Scripts\activate      # Windows
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

Backend runs at:
http://localhost:8000/

---
## Frontend Setup (React + Vite)

### 1. Go to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run frontend server
```bash
npm run dev
```
