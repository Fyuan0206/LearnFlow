from fastapi import APIRouter, Path, HTTPException
from app.schemas.research import TaskUpdateRequest, TaskUpdateResponse
from app.models.database import update_task_status

router = APIRouter()


@router.patch("/api/tasks/{task_id}", response_model=TaskUpdateResponse)
async def update_task(
    task_id: str = Path(...),
    body: TaskUpdateRequest = ...,
) -> TaskUpdateResponse:
    ok = await update_task_status(task_id, body.status)
    if not ok:
        raise HTTPException(status_code=404, detail="Task not found")
    return TaskUpdateResponse(ok=True, taskId=task_id, status=body.status)
