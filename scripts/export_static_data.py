# -*- coding: utf-8 -*-
"""
把 MySQL json_doc 里的全部数据导出为静态 JSON，放到 public/data/。
用途：线上（无后端）部署时，前端自动回退读取这些静态文件。
用法：python scripts/export_static_data.py
"""
import io
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'public', 'data')

# mysql 客户端路径（与 README 一致）
MYSQL = r'F:\mysql\mysql\mysql-8.0.11-winx64\bin\mysql.exe'
if not os.path.exists(MYSQL):
    MYSQL = 'mysql'   # 回退到 PATH

DB = 'java_tutorial'
USER, PWD = 'root', '123456'


def query():
    cmd = [MYSQL, '-u' + USER, '-p' + PWD, '-N', '-B', '-e',
           'SELECT name, data FROM json_doc', DB]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr.decode('utf-8', 'ignore'))
        raise SystemExit('mysql 查询失败')
    return r.stdout.decode('utf-8')


def main():
    out = query()
    os.makedirs(OUT_DIR, exist_ok=True)
    n = 0
    total = 0
    for line in out.split('\n'):
        line = line.rstrip('\r')
        if not line.strip():
            continue
        name, js = line.split('\t', 1)
        p = os.path.join(OUT_DIR, name + '.json')
        with io.open(p, 'w', encoding='utf-8') as f:
            f.write(js)
        n += 1
        total += len(js.encode('utf-8'))
    print('导出 %d 个数据文件 -> %s' % (n, OUT_DIR))
    print('总大小 %.1f KB' % (total / 1024.0))


if __name__ == '__main__':
    main()
