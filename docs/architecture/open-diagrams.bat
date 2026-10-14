@echo off
echo ====================================================
echo   MediPulse Architecture Diagrams Launcher
echo ====================================================
echo.
echo Opening all 7 architecture diagrams in sequential learning order...
echo.

start "" "01-login-flow\login-architecture.html"
start "" "02-multi-site-flow\multi-site-architecture.html"
start "" "03-survey-flow\survey-architecture.html"
start "" "04-orders-flow\orders-architecture.html"
start "" "05-customer-flow\customer-architecture.html"
start "" "06-docman-flow\docman-architecture.html"
start "" "07-activity-log-flow\activity-log-architecture.html"
start "" "medipulse-architecture.html"

echo.
echo All diagrams launched successfully in order!
echo ====================================================
pause
