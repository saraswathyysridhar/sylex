# Sylex - Start Development Servers
Write-Host "Starting Sylex development servers..." -ForegroundColor Cyan

# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; python app.py" -WindowStyle Normal

# Start frontend
Set-Location "$PSScriptRoot\frontend"
npm run dev
