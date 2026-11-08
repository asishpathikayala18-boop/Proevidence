@echo off
title Providence Vedic Destiny App
color 0A

echo ========================================================
echo        PROVIDENCE - VEDIC DESTINY AND PANCHANGAM
echo ========================================================
echo.
echo Starting Providence web server on port 3000...
echo.

cd /d "%~dp0"

start http://localhost:3000

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Node.js...
    node server.js
    goto :end
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Python...
    python -m http.server 3000
    goto :end
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Python launcher (py)...
    py -m http.server 3000
    goto :end
)

echo Opening application directly in default browser...
start "" "index.html"

:end
pause
