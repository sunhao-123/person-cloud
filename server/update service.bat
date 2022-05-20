@echo off
net stop PickingService
del "picking service.exe"
echo picking service.exe 已删除
ren "www.exe" "picking service.exe"
echo 文件重命名成功
net start PickingService
pause