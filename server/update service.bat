@echo off
net stop PickingService
del "picking service.exe"
echo picking service.exe ��ɾ��
ren "www.exe" "picking service.exe"
echo �ļ��������ɹ�
net start PickingService
pause