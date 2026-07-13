@echo off
REM Doble clic en este archivo para descargar el material stock de Pexels.
REM Se ubica en la carpeta scripts\ ; sube a la raiz del proyecto antes de correr.
cd /d "%~dp0.."

echo ============================================================
echo   Descarga de material STOCK (Pexels) para el video del CD
echo ============================================================
echo.

set /p CLAVE="Pega tu clave de Pexels y presiona Enter: "

echo.
echo Descargando... esto puede tardar unos minutos.
echo.

node scripts\download-pexels.mjs %CLAVE%

echo.
echo ============================================================
echo   Terminado. Revisa la carpeta:  public\stock
echo ============================================================
echo.
pause
