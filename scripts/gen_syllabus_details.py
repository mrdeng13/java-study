# -*- coding: utf-8 -*-
"""
生成「知识清单单元详解」数据：db/syllabus_details.sql
结构：{ "m{模块}-u{单元}": { "points": [[名称, 详解], ...], "links": [[文案, tab], ...] } }
对齐方式：按模块/单元下标（生成时会用 syllabusModules 的单元前缀做一致性校验）。
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from syllabus_details_a import DATA as DATA_A
from syllabus_details_b import DATA as DATA_B

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 各模块「相关文章 / 工具入口」链接（tab 与前端 data-tab 一致，含章节 c1~c9）
MODULE_LINKS = {
    0: [("第 3 章 · Java SE 核心", "ch3"), ("原理与源码专栏", "topics"), ("章节测验", "quiz")],
    1: [("第 5 章 · MySQL 数据库", "ch5"), ("章节测验", "quiz"), ("易错点考场", "pitfalls")],
    2: [("第 4 章 · 前端开发", "ch4")],
    3: [("第 6 章 · Spring 全家桶", "ch6"), ("章节测验", "quiz")],
    4: [("第 7 章 · 中间件", "ch7"), ("易错点考场", "pitfalls")],
    5: [("第 8 章 · 工程化必备", "ch8")],
    6: [("刷题训练营（60 题）", "algo"), ("章节测验", "quiz")],
    7: [("第 9 章 · 全栈实战与职业路线", "ch9"), ("大厂分类真题", "companies"), ("面试八股文", "baguwen")],
    8: [("第 3 章 · Java SE 核心", "ch3"), ("原理与源码专栏", "topics")],
    9: [("第 6 章 · Spring 全家桶", "ch6"), ("原理与源码专栏", "topics")],
    10: [("第 7 章 · 中间件", "ch7"), ("大厂分类真题", "companies")],
}

SYLLABUS_TMP = os.path.join(ROOT, 'db', '.tmp_syllabus.json')


def load_syllabus():
    try:
        with open(SYLLABUS_TMP, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None


def main():
    modules = {**DATA_A, **DATA_B}
    syllabus = load_syllabus()
    out = {}
    point_total = 0
    warn = 0

    for mi, units in sorted(modules.items()):
        for ui, (prefix, points) in enumerate(units):
            key = "m%d-u%d" % (mi, ui)
            out[key] = {
                "points": [[n, d] for n, d in points],
                "links": MODULE_LINKS.get(mi, []),
            }
            point_total += len(points)

            # 前缀一致性校验（软校验，只告警不中断）
            if syllabus and mi < len(syllabus) and ui < len(syllabus[mi]['units']):
                actual = syllabus[mi]['units'][ui]['name'].split('：')[0]
                if not (actual.startswith(prefix) or prefix.startswith(actual[:4])):
                    warn += 1
                    print("  [warn] %s 前缀不匹配：内容=\"%s\" 实际=\"%s\"" % (key, prefix, actual))

    js = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    sql_js = js.replace('\\', '\\\\').replace("'", "''")

    out_sql = os.path.join(ROOT, 'db', 'syllabus_details.sql')
    with open(out_sql, 'w', encoding='utf-8') as f:
        f.write("-- 知识清单单元详解（由 scripts/gen_syllabus_details.py 生成，勿手改）\n")
        f.write("-- 导入：mysql -uroot -p java_tutorial < db/syllabus_details.sql\n")
        f.write("INSERT INTO json_doc (name, data) VALUES ('syllabusDetails', '" + sql_js + "') "
                "ON DUPLICATE KEY UPDATE data = VALUES(data);\n")

    print("单元数 = %d  知识点总数 = %d  前缀告警 = %d" % (len(out), point_total, warn))
    print("written ->", out_sql)


if __name__ == '__main__':
    main()
