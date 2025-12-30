# PowerShell script to check current IP address and update mobile app configuration
# Usage: .\check-ip.ps1

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "StressBuster - Network IP Configuration Checker" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Get the current local IP address
$ipAddress = Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object {$_.IPAddress -like "10.*" -or $_.IPAddress -like "192.168.*"} | 
    Select-Object -First 1 -ExpandProperty IPAddress

if ($ipAddress) {
    Write-Host "✅ Current IP Address: $ipAddress" -ForegroundColor Green
    Write-Host ""
    
    # Check what's configured in the mobile app
    $apiFilePath = ".\mobile\src\services\api.js"
    if (Test-Path $apiFilePath) {
        $apiContent = Get-Content $apiFilePath -Raw
        
        if ($apiContent -match "http://([0-9.]+):5001/api") {
            $configuredIP = $matches[1]
            Write-Host "📱 Mobile App Configured IP: $configuredIP" -ForegroundColor Yellow
            
            if ($configuredIP -eq $ipAddress) {
                Write-Host "✅ IP addresses match! Configuration is correct." -ForegroundColor Green
            } else {
                Write-Host "⚠️  IP addresses DO NOT match!" -ForegroundColor Red
                Write-Host ""
                Write-Host "To fix this, update the API_BASE_URL in:" -ForegroundColor Yellow
                Write-Host "  $apiFilePath" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "Change from: http://${configuredIP}:5001/api" -ForegroundColor Red
                Write-Host "Change to:   http://${ipAddress}:5001/api" -ForegroundColor Green
            }
        }
    }
    
    Write-Host ""
    Write-Host "Backend server should be running on:" -ForegroundColor Cyan
    Write-Host "  http://${ipAddress}:5001/api" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host "❌ Could not find local IP address" -ForegroundColor Red
    Write-Host "Make sure you are connected to a network" -ForegroundColor Yellow
}

Write-Host "==================================================" -ForegroundColor Cyan
