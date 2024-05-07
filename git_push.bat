@echo off

cd www
timeout /t 1

git add .
timeout /t 3

git commit -m "auto update"
timeout /t 5

git push
timeout /t 5


