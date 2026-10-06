from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


def create_task(db: Session, task_data: TaskCreate) -> Task:
    task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def get_tasks(
    db: Session,
    status: TaskStatus | None = None,
) -> list[Task]:
    query = select(Task)

    if status is not None:
        query = query.where(Task.status == status)

    query = query.order_by(Task.created_date.desc())

    return list(db.scalars(query).all())


def get_task(db: Session, task_id: int) -> Task | None:
    return db.get(Task, task_id)


def update_task(
    db: Session,
    task: Task,
    task_data: TaskUpdate,
) -> Task:
    update_data = task_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()