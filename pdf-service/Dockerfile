FROM python:3.11-alpine

WORKDIR /app

# Install system build dependencies
RUN apk add --no-cache gcc musl-dev libffi-dev

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8002

ENV PORT=8002

# Run with Gunicorn on port 8002
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
