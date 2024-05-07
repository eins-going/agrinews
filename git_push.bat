@echo off

git add .
timeout /t 10

git commit -m "auto update"
timeout /t 10

git push
timeout /t 20

