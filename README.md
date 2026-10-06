# Taskbox

Taskbox is a full-stack task management application built with React, TypeScript, FastAPI, and PostgreSQL.

## Features

- Create tasks
- View all tasks
- View a single task
- Edit tasks
- Delete tasks
- Update task status
- Set task priority
- Search tasks
- Filter tasks by status and priority
- Frontend and backend validation
- API error handling

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Psycopg 3
- Alembic

### Database
- PostgreSQL

## Project Structure

```text
Taskbox/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── tests/
│   │   └── main.py
│   ├── alembic/
│   ├── alembic.ini
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── .env.example
└── .gitignore
```

## Database Schema

The application uses one `tasks` table.

| Column | Type | Description |
|---|---|---|
| `task_id` | Integer | Primary key |
| `title` | String | Task title |
| `description` | Text | Optional description |
| `status` | Enum | Pending / In Progress / Completed |
| `priority` | Enum | Low / Medium / High |
| `created_date` | Timestamp | Creation time |
| `updated_date` | Timestamp | Last update time |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks` | Get all tasks |
| `GET` | `/tasks?status=Pending` | Filter tasks by status |
| `GET` | `/tasks/{task_id}` | Get a single task |
| `PUT` | `/tasks/{task_id}` | Update a task |
| `DELETE` | `/tasks/{task_id}` | Delete a task |

### Example: Create Task

```json
{
  "title": "Learn FastAPI",
  "description": "Build Taskbox backend",
  "status": "Pending",
  "priority": "High"
}
```

### Status

```text
Pending
In Progress
Completed
```

### Priority

```text
Low
Medium
High
```

## Validation & Error Handling

The backend handles:

- Empty or invalid task titles
- Invalid status values
- Invalid priority values
- Invalid task IDs
- Non-existent tasks
- Invalid request bodies
- Database errors

## Testing

Backend tests cover task CRUD operations, filtering, validation, and error handling.

Run tests:

```bash
cd backend
python -m pytest app/tests/test_tasks.py -v
```

## Local Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m alembic upgrade head
python -m uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+psycopg://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME
```

Do not commit `.env` or database credentials to GitHub.

## License

This project is for educational and portfolio purposes.