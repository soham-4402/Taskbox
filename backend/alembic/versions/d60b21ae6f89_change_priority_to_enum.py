"""change priority to enum

Revision ID: d60b21ae6f89
Revises: b0d5981fc28c
Create Date: 2026-10-05 21:44:03.725582

"""
from typing import Sequence, Union
from sqlalchemy.dialects import postgresql
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd60b21ae6f89'
down_revision: Union[str, Sequence[str], None] = 'b0d5981fc28c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    task_priority = postgresql.ENUM(
        "Low",
        "Medium",
        "High",
        name="task_priority",
    )

    task_priority.create(op.get_bind(), checkfirst=True)

    op.alter_column(
        "tasks",
        "priority",
        existing_type=sa.Boolean(),
        type_=task_priority,
        existing_nullable=False,
        postgresql_using="""
            CASE
                WHEN priority = TRUE THEN 'High'
                ELSE 'Low'
            END::task_priority
        """,
    )

def downgrade() -> None:
    op.alter_column(
        "tasks",
        "priority",
        existing_type=postgresql.ENUM(
            "Low",
            "Medium",
            "High",
            name="task_priority",
        ),
        type_=sa.Boolean(),
        existing_nullable=False,
        postgresql_using="""
            CASE
                WHEN priority = 'High' THEN TRUE
                ELSE FALSE
            END
        """,
    )

    task_priority = postgresql.ENUM(
        "Low",
        "Medium",
        "High",
        name="task_priority",
    )

    task_priority.drop(op.get_bind(), checkfirst=True)