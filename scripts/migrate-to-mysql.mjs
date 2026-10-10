// 迁移脚本：读取 src/data 下所有数据模块，生成 db/seed.sql（单表 json_doc）
// 用法：node scripts/migrate-to-mysql.mjs
// 纯 Node 内置模块，无需安装任何依赖（离线环境）。

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const OUT_DIR = path.join(ROOT, 'db');
const OUT_FILE = path.join(OUT_DIR, 'seed.sql');

// 把 JSON 文本转义为 MySQL 单引号字符串字面量
function sqlEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "''");
}

// 将某个数据文件复制为临时 .mjs 后动态导入，返回其导出对象
async function importDataModule(file) {
  const code = fs.readFileSync(file, 'utf8');
  const tmp = path.join(os.tmpdir(), `mig-${path.basename(file)}.mjs`);
  fs.writeFileSync(tmp, code, 'utf8');
  try {
    const mod = await import(pathToFileURL(tmp).href);
    return mod;
  } finally {
    fs.unlinkSync(tmp);
  }
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.js'))
    .sort();

  const lines = [];
  lines.push('-- 自动生成，勿手改。由 scripts/migrate-to-mysql.mjs 生成');
  lines.push('SET NAMES utf8mb4;');
  lines.push('SET foreign_key_checks = 0;');
  lines.push('DROP TABLE IF EXISTS json_doc;');
  lines.push(`CREATE TABLE json_doc (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  data JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
  lines.push('');

  let count = 0;
  for (const f of files) {
    const file = path.join(DATA_DIR, f);
    let mod;
    try {
      mod = await importDataModule(file);
    } catch (e) {
      console.error(`[跳过] ${f} 导入失败: ${e.message}`);
      continue;
    }
    const keys = Object.keys(mod).filter((k) => k !== 'default');
    for (const name of keys) {
      let value = mod[name];
      if (value === undefined || value === null) continue;
      let json;
      try {
        json = JSON.stringify(value);
      } catch (e) {
        console.error(`[跳过] ${f}#${name} 不可序列化`);
        continue;
      }
      if (json === undefined) continue;
      lines.push(
        `INSERT INTO json_doc (name, data) VALUES ('${sqlEscape(name)}', '${sqlEscape(json)}');`
      );
      count++;
    }
    console.log(`已处理 ${f}（导出 ${keys.length} 个）`);
  }

  fs.writeFileSync(OUT_FILE, lines.join('\n') + '\n', 'utf8');
  console.log(`\n生成完成：${OUT_FILE}`);
  console.log(`共写入 ${count} 条数据记录。`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
