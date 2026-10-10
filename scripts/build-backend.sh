#!/usr/bin/env bash
# 离线构建后端：从本地 Maven 仓库拷贝去重后的 jar 到 backend/lib，再用 javac 编译。
set -e
REPO="/f/maven/MAVEN—local repository"
JAVAC=/f/jdk/jdk-17.0.14/bin/javac
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# LIB/OUT 放在项目内（沙箱允许写入）。再用 cygpath -w 转成 Windows 原生反斜杠路径，
# 避免 MSYS 把中文路径(/d/学系)转坏，导致 javac 读不到 jar。
LIB="$ROOT/backend/lib"
OUT="$ROOT/backend/out"
SRC="$ROOT/backend/src/main/java"
RES="$ROOT/backend/src/main/resources"

mkdir -p "$LIB" "$OUT"

# 仅当 lib 为空时才拷贝（加速重复构建）
if [ -z "$(ls -A "$LIB" 2>/dev/null)" ]; then
  echo "=== 从本地仓库拷贝依赖（按 artifact 取最高版本，去除 sources/javadoc）==="
  find "$REPO" -name '*.jar' ! -name '*sources*' ! -name '*javadoc*' \
    | awk -F'/' '{ n=NF; ver=$(n-1); art=$(n-2); adir=""; for(i=1;i<=n-2;i++) adir=adir"/"$i; print adir"|"ver"|"$0 }' \
    | sort -t'|' -k1,1 -k2,2V \
    | awk -F'|' '{ a[$1]=$3 } END { for(k in a) print a[k] }' \
    | while read -r jar; do
        cp "$jar" "$LIB"/ 2>/dev/null || true
      done
  echo "已拷贝 jar 数量：$(ls "$LIB" | wc -l)"
else
  echo "=== lib 已存在，跳过拷贝 ==="
fi

echo "=== 编译 Java 源码 ==="
rm -rf "$OUT" && mkdir -p "$OUT"
LIBW="$(cygpath -w "$LIB")"
OUTW="$(cygpath -w "$OUT")"
# 用 Java 支持的目录通配符 lib\* 一次性涵盖所有 jar；Windows 反斜杠路径
CPW="$LIBW\\*"
# 进入源码目录用相对路径编译，规避中文绝对路径在 javac 下的转换问题
( cd "$SRC" && "$JAVAC" -parameters -encoding UTF-8 -cp "$CPW" -d "$OUTW" $(find . -name '*.java') )
cp -r "$RES"/. "$OUT"/
echo "=== 编译完成，class 已输出到 $OUT ==="
