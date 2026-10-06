from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import DateTime, Enum as SQLEnum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class TaskStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"


class TaskPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Task(Base):
    __tablename__ = "tasks"

    task_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[TaskStatus] = mapped_column(
        SQLEnum(TaskStatus, name="task_status"),
        nullable=False,
        default=TaskStatus.PENDING,
    )

    priority: Mapped[TaskPriority] = mapped_column(
    SQLEnum(
        TaskPriority,
        name="task_priority",
        values_callable=lambda enum: [item.value for item in enum],
    ),
    nullable=False,
    default=TaskPriority.MEDIUM,
)

    created_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )