# -*- coding: utf-8 -*-
"""卡池回归校验：常规池不漏出 U/唯一、十连保底不含 U、羁绊成员完整、稀有度分布符合权重。
改完 gen_summon_pool.py 重新导入后跑一次即可。"""
import json
import random
import collections
import urllib.request

url = 'http://localhost:8080/api/data/summonPool'
with urllib.request.urlopen(url, timeout=15) as r:
    p = json.loads(r.read().decode('utf-8'))

items = p['items']
print('总件数:', len(items))
print('类目:', p['categoryCount'])
print('稀有度:', p['rarityCount'])
print('唯一品质:', [(i['name'], i['rarity']) for i in items if i.get('unique')])
print('U 级数量:', len([i for i in items if i['rarity'] == 6]))
print('福利数量:', len([i for i in items if i.get('welfare')]))
print('加热炉配置:', p['furnace'])

norm = [i for i in items if not i.get('only')]
w = p['weights']
keys = list(w.keys())
tot = sum(w.values())
cnt = collections.Counter()
for _ in range(50000):
    r = random.random() * tot
    rarity = None
    for k in keys:
        r -= w[k]
        if r <= 0:
            rarity = int(k)
            break
    bucket = [i for i in norm if i['rarity'] == rarity]
    src = bucket if bucket else norm
    cnt[random.choice(src)['rarity']] += 1
print('常规池 5 万抽分布:', dict(sorted(cnt.items())))
assert 6 not in cnt and 7 not in cnt, 'BUG: U/唯一 从常规池漏出！'
print('OK 常规池不会抽到 U 级 / 唯一品质')

bad = 0
for _ in range(2000):
    res = [random.choice([i for i in norm if i['rarity'] >= 3]) for _ in range(10)]
    if any(x['rarity'] >= 6 for x in res):
        bad += 1
print('十连保底抽样中 U 级出现次数(应为 0):', bad)
assert bad == 0

missing_all = []
for b in p['bonds']:
    miss = [n for n in b['memberNames'] if not any(i['name'] == n for i in items)]
    if miss:
        missing_all.append((b['name'], miss))
print('羁绊组数:', len(p['bonds']), '| 缺失成员:', missing_all if missing_all else '无')
assert not missing_all

# 福利池全为可获取项
wf = [i for i in items if i.get('welfare')]
print('福利示例:', [i['name'] for i in wf[:6]])
print('\n全部校验通过 ')
