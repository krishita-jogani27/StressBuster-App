# StressBuster Firewall Fix Script
# This script adds a Windows Firewall rule to allow Node.js backend connections
# Run this script as Administrator

Write-Host "=================================================="
Write-Host "StressBuster - Firewall Configuration"
Write-Host "=================================================="
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To run as Administrator:" -ForegroundColor Yellow
    Write-Host "1. Right-click on this file" -ForegroundColor Yellow
    Write-Host "2. Select 'Run with PowerShell'" -ForegroundColor Yellow
    Write-Host "3. Click 'Yes' when prompted" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Adding firewall rule for Node.js backend (Port 5000)..." -ForegroundColor Cyan

try {
    # Remove existing rule if it exists
    Remove-NetFirewallRule -DisplayName "StressBuster Node.js Backend" -ErrorAction SilentlyContinue
    
    # Add new firewall rule
    New-NetFirewallRule `
        -DisplayName "StressBuster Node.js Backend" `
        -Description "Allows inbound connections to StressBuster Node.js backend server on port 5000" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 5000 `
        -Action Allow `
        -Profile Any `
        -Enabled True | Out-Null
    
    Write-Host ""
    Write-Host "SUCCESS! Firewall rule added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "What this does:" -ForegroundColor Yellow
    Write-Host "- Allows your phone to connect to the backend on port 5000" -ForegroundColor White
    Write-Host "- Keeps Windows Firewall enabled for security" -ForegroundColor White
    Write-Host "- Works on all network types (Private, Public, Domain)" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart your backend server (Ctrl+C, then 'npm start')" -ForegroundColor White
    Write-Host "2. Test from your phone's browser: http://192.168.29.195:5000/api/health" -ForegroundColor White
    Write-Host "3. If you see JSON response, close and reopen your app!" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to add firewall rule!" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=================================================="
Read-Host "Press Enter to exit"
