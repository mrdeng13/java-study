@echo off
REM 后端编译脚本（项目用 javac 直编到 out/，不走 maven 布局）
cd /d %~dp0

REM 1) 编译所有源码到 out/（源码为 UTF-8，必须指定 -encoding UTF-8；
REM    -parameters 让 Spring 能识别 @RequestParam/@PathVariable 的参数名）
javac -encoding UTF-8 -parameters -cp "lib/*" -d out ^
  src/main/java/com/tutorial/TutorialApplication.java ^
  src/main/java/com/tutorial/controller/DataController.java ^
  src/main/java/com/tutorial/controller/ProgressController.java ^
  src/main/java/com/tutorial/config/CorsConfig.java
if errorlevel 1 (
  echo [BUILD] 编译失败
  exit /b 1
)

REM 2) 拷贝配置到 out/（运行时 classpath 根）
if not exist "out" mkdir out
copy /Y src\main\resources\application.properties out\application.properties

echo [BUILD] 完成。运行： java -cp "out;lib/*" com.tutorial.TutorialApplication
