from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.db.database import Base, get_db
from app.main import app


# ---------------------------------------------------------
# Test database
# ---------------------------------------------------------

TEST_DATABASE_URL = "sqlite://"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def clear_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------

def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


# ---------------------------------------------------------
# Create Task
# ---------------------------------------------------------

def test_create_task():
    clear_database()

    response = client.post(
        "/tasks",
        json={
            "title": "Learn FastAPI",
            "description": "Build Taskbox backend",
            "status": "Pending",
            "priority": "High",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["task_id"] == 1
    assert data["title"] == "Learn FastAPI"
    assert data["description"] == "Build Taskbox backend"
    assert data["status"] == "Pending"
    assert data["priority"] == "High"
    assert "created_date" in data
    assert "updated_date" in data


# ---------------------------------------------------------
# Get All Tasks
# ---------------------------------------------------------

def test_get_all_tasks():
    clear_database()

    client.post(
        "/tasks",
        json={
            "title": "Task 1",
            "description": "First task",
            "status": "Pending",
            "priority": "Low",
        },
    )

    client.post(
        "/tasks",
        json={
            "title": "Task 2",
            "description": "Second task",
            "status": "Completed",
            "priority": "High",
        },
    )

    response = client.get("/tasks")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2
    assert data[0]["priority"] in ["Low", "Medium", "High"]
    assert data[1]["priority"] in ["Low", "Medium", "High"]


# ---------------------------------------------------------
# Filter Tasks By Status
# ---------------------------------------------------------

def test_filter_tasks_by_status():
    clear_database()

    client.post(
        "/tasks",
        json={
            "title": "Pending Task",
            "description": "Pending",
            "status": "Pending",
            "priority": "Medium",
        },
    )

    client.post(
        "/tasks",
        json={
            "title": "Completed Task",
            "description": "Completed",
            "status": "Completed",
            "priority": "Low",
        },
    )

    response = client.get("/tasks?status=Pending")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["title"] == "Pending Task"
    assert data[0]["status"] == "Pending"
    assert data[0]["priority"] == "Medium"


# ---------------------------------------------------------
# Get Single Task
# ---------------------------------------------------------

def test_get_single_task():
    clear_database()

    create_response = client.post(
        "/tasks",
        json={
            "title": "Single Task",
            "description": "Test task",
            "status": "Pending",
            "priority": "Medium",
        },
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["task_id"]

    response = client.get(f"/tasks/{task_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["task_id"] == task_id
    assert data["title"] == "Single Task"
    assert data["priority"] == "Medium"


# ---------------------------------------------------------
# Get Non-existent Task
# ---------------------------------------------------------

def test_get_nonexistent_task():
    clear_database()

    response = client.get("/tasks/999")

    assert response.status_code == 404

    assert response.json()["detail"] == (
        "Task with ID 999 was not found."
    )


# ---------------------------------------------------------
# Update Task
# ---------------------------------------------------------

def test_update_task():
    clear_database()

    create_response = client.post(
        "/tasks",
        json={
            "title": "Original Task",
            "description": "Original description",
            "status": "Pending",
            "priority": "Low",
        },
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["task_id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "Updated Task",
            "description": "Updated description",
            "status": "In Progress",
            "priority": "High",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Updated Task"
    assert data["description"] == "Updated description"
    assert data["status"] == "In Progress"
    assert data["priority"] == "High"


# ---------------------------------------------------------
# Partial Update
# ---------------------------------------------------------

def test_partial_update():
    clear_database()

    create_response = client.post(
        "/tasks",
        json={
            "title": "My Task",
            "description": "Description",
            "status": "Pending",
            "priority": "Low",
        },
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["task_id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={
            "priority": "High",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "My Task"
    assert data["status"] == "Pending"
    assert data["priority"] == "High"


# ---------------------------------------------------------
# Delete Task
# ---------------------------------------------------------

def test_delete_task():
    clear_database()

    create_response = client.post(
        "/tasks",
        json={
            "title": "Delete Me",
            "description": "Temporary task",
            "status": "Pending",
            "priority": "Low",
        },
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["task_id"]

    response = client.delete(f"/tasks/{task_id}")

    assert response.status_code == 204

    get_response = client.get(f"/tasks/{task_id}")

    assert get_response.status_code == 404


# ---------------------------------------------------------
# Delete Non-existent Task
# ---------------------------------------------------------

def test_delete_nonexistent_task():
    clear_database()

    response = client.delete("/tasks/999")

    assert response.status_code == 404


# ---------------------------------------------------------
# Validation - Empty Title
# ---------------------------------------------------------

def test_create_task_with_empty_title():
    clear_database()

    response = client.post(
        "/tasks",
        json={
            "title": "",
            "description": "Invalid task",
            "status": "Pending",
            "priority": "Low",
        },
    )

    assert response.status_code == 422

    data = response.json()

    assert data["detail"] == "Invalid request."
    assert len(data["errors"]) > 0


# ---------------------------------------------------------
# Validation - Invalid Status
# ---------------------------------------------------------

def test_create_task_with_invalid_status():
    clear_database()

    response = client.post(
        "/tasks",
        json={
            "title": "Invalid Status Task",
            "description": "Test",
            "status": "Random Status",
            "priority": "Low",
        },
    )

    assert response.status_code == 422


# ---------------------------------------------------------
# Validation - Invalid Task ID
# ---------------------------------------------------------

def test_invalid_task_id():
    clear_database()

    response = client.get("/tasks/abc")

    assert response.status_code == 422


# ---------------------------------------------------------
# Validation - Invalid Priority
# ---------------------------------------------------------

def test_create_task_with_invalid_priority():
    clear_database()

    response = client.post(
        "/tasks",
        json={
            "title": "Invalid Priority Task",
            "description": "Test",
            "status": "Pending",
            "priority": "Urgent",
        },
    )

    assert response.status_code == 422