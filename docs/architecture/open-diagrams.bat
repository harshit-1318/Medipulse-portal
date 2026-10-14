@echo off
echo ====================================================
echo   MediPulse Architecture Diagrams Launcher
echo ====================================================
echo.
echo Opening all architecture diagrams in your default browser...
echo.

start "" "login-flow\login-architecture.html"
start "" "orders-flow\orders-architecture.html"
start "" "multi-site-flow\multi-site-architecture.html"
start "" "survey-flow\survey-architecture.html"
start "" "customer-flow\customer-architecture.html"
start "" "activity-log-flow\activity-log-architecture.html"
start "" "docman-flow\docman-architecture.html"
start "" "medipulse-architecture.html"

echo.
echo All 7 diagrams launched successfully!
echo ====================================================
pause
