from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.task import TaskStatus
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services import task as task_service


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
):
    return task_service.create_task(db, task_data)


@router.get(
    "",
    response_model=list[TaskResponse],
)
def get_tasks(
    status_filter: TaskStatus | None = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
):
    return task_service.get_tasks(db, status_filter)


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = task_service.get_task(db, task_id)

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} was not found.",
        )

    return task


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
):
    task = task_service.get_task(db, task_id)

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} was not found.",
        )

    return task_service.update_task(db, task, task_data)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = task_service.get_task(db, task_id)

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} was not found.",
        )

    task_service.delete_task(db, task)