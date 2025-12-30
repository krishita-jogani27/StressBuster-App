# Script to restart the backend server
# This ensures the new profile endpoints are loaded

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restarting StressBuster Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find the backend server process
$backendProcess = Get-Process -Name node -ErrorAction SilentlyContinue | 
    Where-Object { $_.Path -like "*StressBuster App\backend*" }

if ($backendProcess) {
    Write-Host "⏹️  Stopping old backend server (PID: $($backendProcess.Id))..." -ForegroundColor Yellow
    Stop-Process -Id $backendProcess.Id -Force
    Start-Sleep -Seconds 2
    Write-Host "✅ Old server stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No running backend server found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Starting backend server with new profile endpoints..." -ForegroundColor Cyan
Write-Host ""

# Change to backend directory and start server
Set-Location ".\backend"
npm start
