from fastapi import APIRouter, Depends, HTTPException, Request, Form
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from typing import List, Optional
from app.repositories.member_repository import MemberRepository, get_member_repository
from fastapi.templating import Jinja2Templates

router: APIRouter = APIRouter()
templates: Jinja2Templates = Jinja2Templates(directory="app/templates")


class MemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class MemberUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)


class Member(BaseModel):
    id: UUID
    name: str


@router.get("/members", response_class=HTMLResponse)
async def list_members(
    request: Request, repo: MemberRepository = Depends(get_member_repository)
):
    members = await repo.list()
    return templates.TemplateResponse(
        "members/list.html", {"request": request, "members": members}
    )


@router.post("/members", response_class=HTMLResponse)
async def create_member(
    request: Request,
    name: str = Form(...),
    repo: MemberRepository = Depends(get_member_repository),
):
    member_id = uuid4()
    created_member = await repo.create(id=member_id, name=name)
    return templates.TemplateResponse(
        "members/member_row.html", {"request": request, "member": created_member}
    )


@router.get("/members/{member_id}", response_class=HTMLResponse)
async def get_member(
    request: Request,
    member_id: UUID,
    repo: MemberRepository = Depends(get_member_repository),
):
    member = await repo.get(member_id)
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return templates.TemplateResponse(
        "members/detail.html", {"request": request, "member": member}
    )


@router.put("/members/{member_id}", response_class=HTMLResponse)
async def update_member(
    request: Request,
    member_id: UUID,
    member: MemberUpdate,
    repo: MemberRepository = Depends(get_member_repository),
):
    updated_member = await repo.update(member_id, member.dict(exclude_unset=True))
    if updated_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return templates.TemplateResponse(
        "members/member_row.html", {"request": request, "member": updated_member}
    )


@router.delete("/members/{member_id}", response_class=HTMLResponse)
async def delete_member(
    member_id: UUID, repo: MemberRepository = Depends(get_member_repository)
):
    deleted = await repo.delete(member_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Member not found")
    return ""  # Return an empty response to remove the row from the UI
