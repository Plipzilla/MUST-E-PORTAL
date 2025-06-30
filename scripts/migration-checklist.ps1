# MUST-E-Portal Laravel Backend Migration Checklist
# Complete verification of Laravel + MySQL system

Write-Host "🚀 MUST-E-Portal Migration Checklist" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$checksPassed = 0
$totalChecks = 0

function Test-Check {
    param($description, $scriptBlock)
    $global:totalChecks++
    Write-Host "`n[$global:totalChecks] $description" -ForegroundColor Yellow
    try {
        $result = & $scriptBlock
        if ($result) {
            Write-Host "   ✅ PASS" -ForegroundColor Green
            $global:checksPassed++
            return $true
        } else {
            Write-Host "   ❌ FAIL" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# 1. Environment Setup
Test-Check "PHP 8.2+ Available" {
    $phpVersion = & "C:\xampp\php\php.exe" -v 2>$null
    return $phpVersion -match "PHP 8\.[2-9]"
}

Test-Check "Composer Available" {
    $composerVersion = & "C:\xampp\php\php.exe" "C:\xampp\php\composer.phar" --version 2>$null
    return $composerVersion -match "Composer"
}

Test-Check "MySQL Service Running" {
    $mysqlProcess = Get-Process mysqld -ErrorAction SilentlyContinue
    return $mysqlProcess -ne $null
}

# 2. Laravel Installation
Test-Check "Laravel Project Structure" {
    return (Test-Path "artisan") -and (Test-Path "app") -and (Test-Path "config")
}

Test-Check "Laravel Version 10.x" {
    $version = & "C:\xampp\php\php.exe" artisan --version 2>$null
    return $version -match "Laravel Framework 10\."
}

Test-Check ".env File Configured" {
    $envContent = Get-Content ".env" -Raw
    return $envContent -match "must_portal" -and $envContent -match "SESSION_LIFETIME=30"
}

# 3. Required Packages
Test-Check "Laravel Passport Installed" {
    $composer = Get-Content "composer.json" | ConvertFrom-Json
    return $composer.require."laravel/passport" -ne $null
}

Test-Check "Laravel Socialite Installed" {
    $composer = Get-Content "composer.json" | ConvertFrom-Json
    return $composer.require."laravel/socialite" -ne $null
}

Test-Check "Spatie Permission Installed" {
    $composer = Get-Content "composer.json" | ConvertFrom-Json
    return $composer.require."spatie/laravel-permission" -ne $null
}

# 4. Database Setup
Test-Check "Database Connection" {
    $result = & "C:\xampp\php\php.exe" artisan migrate:status 2>$null
    return $LASTEXITCODE -eq 0
}

Test-Check "All Migrations Run" {
    $migrations = & "C:\xampp\php\php.exe" artisan migrate:status 2>$null
    return $migrations -match "Ran" -and $migrations -notmatch "Pending"
}

Test-Check "Passport Keys Generated" {
    return (Test-Path "storage/oauth-private.key") -and (Test-Path "storage/oauth-public.key")
}

# 5. Database Schema
Test-Check "Users Table with Social Fields" {
    $result = & "C:\xampp\mysql\bin\mysql.exe" -u root -D must_portal -e "DESCRIBE users;" 2>$null
    return $result -match "google_id" -and $result -match "facebook_id"
}

Test-Check "Application Drafts Table" {
    $result = & "C:\xampp\mysql\bin\mysql.exe" -u root -D must_portal -e "SHOW TABLES LIKE 'application_drafts';" 2>$null
    return $result -match "application_drafts"
}

Test-Check "Work Experiences Table" {
    $result = & "C:\xampp\mysql\bin\mysql.exe" -u root -D must_portal -e "SHOW TABLES LIKE 'work_experiences';" 2>$null
    return $result -match "work_experiences"
}

Test-Check "Referees Table" {
    $result = & "C:\xampp\mysql\bin\mysql.exe" -u root -D must_portal -e "SHOW TABLES LIKE 'referees';" 2>$null
    return $result -match "referees"
}

Test-Check "Application Submissions Table" {
    $result = & "C:\xampp\mysql\bin\mysql.exe" -u root -D must_portal -e "SHOW TABLES LIKE 'application_submissions';" 2>$null
    return $result -match "application_submissions"
}

Test-Check "Spatie Permission Tables" {
    $result = & "C:\xampp\mysql\bin\mysql.exe" -u root -D must_portal -e "SHOW TABLES LIKE '%permission%';" 2>$null
    return $result -match "permissions" -and $result -match "roles"
}

# 6. Seeded Data
Test-Check "Roles Created (admin, reviewer, user)" {
    $result = & "C:\xampp\mysql\bin\mysql.exe" -u root -D must_portal -e "SELECT name FROM roles;" 2>$null
    return $result -match "admin" -and $result -match "reviewer" -and $result -match "user"
}

Test-Check "Permissions Created" {
    $result = & "C:\xampp\mysql\bin\mysql.exe" -u root -D must_portal -e "SELECT COUNT(*) FROM permissions;" 2>$null
    return $result -match "[1-9][0-9]*"
}

Test-Check "Sample Users Created" {
    $result = & "C:\xampp\mysql\bin\mysql.exe" -u root -D must_portal -e "SELECT email FROM users WHERE email LIKE '%must.ac.mw';" 2>$null
    return $result -match "admin@must.ac.mw"
}

# 7. API Endpoints
Test-Check "Laravel Server Responsive" {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000" -Method GET -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

Test-Check "API Routes Configured" {
    return (Test-Path "routes/api.php") -and (Get-Content "routes/api.php" -Raw) -match "auth"
}

Test-Check "Controllers Exist" {
    return (Test-Path "app/Http/Controllers/AuthController.php") -and (Test-Path "app/Http/Controllers/ApplicationController.php")
}

Test-Check "Models with Relationships" {
    return (Test-Path "app/Models/User.php") -and (Test-Path "app/Models/ApplicationDraft.php")
}

# 8. Configuration Files
Test-Check "CORS Configuration" {
    return (Test-Path "config/cors.php")
}

Test-Check "Passport Configuration" {
    return (Test-Path "config/passport.php")
}

Test-Check "Services Configuration" {
    $servicesConfig = Get-Content "config/services.php" -Raw
    return $servicesConfig -match "google" -and $servicesConfig -match "facebook"
}

# 9. Middleware
Test-Check "Custom Middleware Exists" {
    return (Test-Path "app/Http/Middleware/CheckRole.php") -and (Test-Path "app/Http/Middleware/CheckUserActivity.php")
}

# Final Results
Write-Host "`n" -NoNewline
Write-Host "🎯 MIGRATION CHECKLIST RESULTS" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Checks Passed: $checksPassed / $totalChecks" -ForegroundColor $(if ($checksPassed -eq $totalChecks) { "Green" } else { "Yellow" })

$percentage = [math]::Round(($checksPassed / $totalChecks) * 100, 1)
Write-Host "Success Rate: $percentage%" -ForegroundColor $(if ($percentage -ge 90) { "Green" } elseif ($percentage -ge 75) { "Yellow" } else { "Red" })

if ($checksPassed -eq $totalChecks) {
    Write-Host "`n🎉 MIGRATION COMPLETE! All systems ready for production." -ForegroundColor Green
} elseif ($percentage -ge 90) {
    Write-Host "`n⚠️  Migration mostly complete. Minor issues to resolve." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Migration incomplete. Please review failed checks." -ForegroundColor Red
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Update React frontend to use Laravel API" -ForegroundColor White
Write-Host "   2. Configure OAuth credentials in .env" -ForegroundColor White
Write-Host "   3. Test all application features" -ForegroundColor White
Write-Host "   4. Deploy to production server" -ForegroundColor White 