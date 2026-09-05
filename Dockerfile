FROM python:3.11-slim

# Prevent Python from writing .pyc files to disc and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY backend/app ./app

# Expose port (Railway dynamically injects $PORT)
ENV PORT=8000
EXPOSE 8000

# Run FastAPI with uvicorn bound to Railway's assigned $PORT
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"
