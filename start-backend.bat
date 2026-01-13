@echo off
REM Script per avviare il server PHP per SimFito Mobile Backend (Windows)
REM Uso: start-backend.bat

cd /d "%~dp0\backend" || exit /b 1

echo.
echo ========================================
echo.
echo   ^^ Avviando PHP server su http://localhost:8000
echo   Backend: %CD%
echo   Premi Ctrl+C per stoppare
echo.
echo ========================================
echo.

php -S localhost:8000
