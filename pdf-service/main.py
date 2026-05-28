from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
import textwrap

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

class PDFRequest(BaseModel):
    title: str
    content: str

@app.post("/generate")
async def generate_pdf(req: PDFRequest):
    if not req.title or not req.content:
        raise HTTPException(status_code=400, detail="Title and content are required.")
    # Create PDF in memory
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawString(72, height - 72, req.title)
    # Content
    text_obj = c.beginText()
    text_obj.setTextOrigin(72, height - 120)
    text_obj.setFont("Helvetica", 12)
    for paragraph in req.content.split("\n"):
        for wrapped_line in textwrap.wrap(paragraph, width=80):
            text_obj.textLine(wrapped_line)
    c.drawText(text_obj)
    c.showPage()
    c.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": f'attachment; filename="{req.title.replace(" ", "_")}.pdf"'
    })
