# Taskbox

A simple full-stack task management application built with React, FastAPI, PostgreSQL, and AWS.

## Features

- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- Change task status
- Set task priority
- Search tasks
- Filter by status
- Filter by priority
- Frontend validation
- Backend validation
- API error handling
- Health-check endpoint

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
- Uvicorn
- Alembic

### Database

- PostgreSQL
- Amazon RDS PostgreSQL for production

### Deployment

- AWS EC2
- AWS RDS
- Nginx
- GitHub
- AWS VPC
- AWS Security Groups

---

## Architecture

```text
                    Internet
                       |
                       v
                  +---------+
                  |  Nginx  |
                  |  EC2    |
                  +----+----+
                       |
              +--------+--------+
              |                 |
              v                 v
       React Frontend      FastAPI API
                               |
                               v
                       PostgreSQL RDS