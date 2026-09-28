#!/bin/bash
# Azure Linux App Service Startup Script for MedGuide

echo "Starting MedGuide on Azure App Service..."

# Activate virtual environment if Oryx created one
if [ -d "/home/site/wwwroot/antenv" ]; then
    source /home/site/wwwroot/antenv/bin/activate
elif [ -d "/antenv" ]; then
    source /antenv/bin/activate
fi

# Ensure root directory is on PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:/home/site/wwwroot"

PORT="${PORT:-8000}"

# Start Uvicorn bound to 0.0.0.0
python -m uvicorn backend.main:app --host 0.0.0.0 --port "$PORT"
