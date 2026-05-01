# Guru Pintar - Development Start Script (Windows)

# 1. Add Bun to PATH for this session
$env:PATH = "C:\Users\Avelinelyn\.bun\bin;" + $env:PATH

# 2. Check if Bun is available
if (!(Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Bun not found at C:\Users\Avelinelyn\.bun\bin\bun.exe" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Starting Guru Pintar Stack..." -ForegroundColor Cyan

# 3. Start API Server on Port 3001
Write-Host "Starting API on http://localhost:3001..."
$apiJob = Start-Job -ScriptBlock {
    $env:PORT = "3001"
    $env:PATH = "C:\Users\Avelinelyn\.bun\bin;" + $env:PATH
    cd "g:\Project\Javascript\guru_pintar\apps\api"
    bun run dev
}

# 4. Start Web Frontend on Port 3000
Write-Host "Starting Web Frontend on http://localhost:3000..."
$webJob = Start-Job -ScriptBlock {
    $env:PORT = "3000"
    $env:PATH = "C:\Users\Avelinelyn\.bun\bin;" + $env:PATH
    cd "g:\Project\Javascript\guru_pintar\apps\web"
    bun run dev
}

Write-Host "Server running! Press Ctrl+C to stop (though jobs will run in background)." -ForegroundColor Green
Write-Host "API: http://localhost:3001"
Write-Host "Web: http://localhost:3000"

# Keep the script running to monitor jobs
try {
    while ($true) {
        $apiState = Get-Job -Id $apiJob.Id
        $webState = Get-Job -Id $webJob.Id
        
        if ($apiState.State -eq "Failed" -or $webState.State -eq "Failed") {
            Write-Host "One of the servers failed!" -ForegroundColor Red
            break
        }
        Start-Sleep -Seconds 2
    }
}
finally {
    Write-Host "Stopping servers..."
    Stop-Job -Id $apiJob.Id
    Stop-Job -Id $webJob.Id
    Remove-Job -Id $apiJob.Id
    Remove-Job -Id $webJob.Id
}
