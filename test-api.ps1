# Test MUST-E-Portal Laravel API

Write-Host "Testing MUST-E-Portal Laravel API..." -ForegroundColor Green

# Test 1: Basic Laravel welcome page
Write-Host "`n1. Testing Laravel Welcome Page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000" -Method GET -UseBasicParsing
    Write-Host "✅ Laravel Welcome: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Laravel Welcome Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Login with sample admin user
Write-Host "`n2. Testing Login..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@must.ac.mw"
    password = "password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Login: $($loginResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($loginResponse.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green 