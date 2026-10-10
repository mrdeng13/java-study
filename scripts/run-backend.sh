#!/usr/bin/env bash
# 运行后端（依赖已编译到 backend/out，jar 在 backend/lib）
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIB="$ROOT/backend/lib"
OUT="$ROOT/backend/out"
JAVA=/f/jdk/jdk-17.0.14/bin/java
# 转成 Windows 反斜杠路径，用 ; 连接，规避中文路径在 java 下的转换问题
OUTW="$(cygpath -w "$OUT")"
LIBW="$(cygpath -w "$LIB")"
CPW="$OUTW;$LIBW\\*"
# 所有配置用命令行参数显式传入，避免 classpath 资源加载（中文路径编码）导致配置未生效
exec "$JAVA" -cp "$CPW" com.tutorial.TutorialApplication \
  --server.port=8080 \
  "--spring.datasource.url=jdbc:mysql://localhost:3306/java_tutorial?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&characterEncoding=UTF-8" \
  --spring.datasource.username=root \
  --spring.datasource.password=123456 \
  --spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver \
  --spring.jackson.default-property-inclusion=NON_NULL
