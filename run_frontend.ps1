# run_frontend.ps1
# Starts the React + Vite frontend development server

Write-Output "Starting MedGuide Frontend..."
Set-Location -Path "$PSScriptRoot\frontend"
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
npm run dev
