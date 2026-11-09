#!/usr/bin/env node
/**
 * check-translations.js
 * --------------------------------------------------------------------------
 * 扫描 docs/source 下的英文源 .md 文件，检查各语言翻译的覆盖情况与时效性。
 *
 * 用法:
 *   node scripts/check-translations.js            # 检查并打印可读报告
 *   node scripts/check-translations.js --update   # 将当前已译文件的源哈希写入 translation_status.json
 *   node scripts/check-translations.js --json     # 输出 JSON 报告（供 CI / 工具消费）
 *
 * 退出码:
 *   0 = 所有源文件均已翻译且为最新
 *   1 = 存在缺失(missing)或过期(outdated)的翻译（可在 CI 中令步骤失败）
 *
 * 工作原理:
 *   - 遍历 source/ 下所有 .md（排除语言目录自身、自动生成/无需翻译的内容）。
 *   - 对每个语言目录（默认 zh-cn）检查对应译文是否存在。
 *   - 译文存在且 translation_status.json 中记录的源哈希与当前源一致 => ok
 *   - 译文存在但源文件自上次记录后被修改 => outdated（提示需同步）
 *   - 译文不存在 => missing
 *   - 首次运行（status 中无记录）的已译文件视为 ok，并在 --update 时记录。
 * --------------------------------------------------------------------------
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SOURCE_ROOT = path.resolve(__dirname, '..', 'source');
const STATUS_FILE = path.resolve(__dirname, '..', 'translation_status.json');

// 需要检查的语言目录（相对 source/）。新增语言只需在此追加。
const LANGS = ['zh-cn'];

// 排除规则：自动生成 / 无需翻译 / 非文档内容。匹配相对于 source/ 的 posix 路径。
const EXCLUDE = [
  /release_notes[\\/]onprem[\\/]/, // 自动生成的 on-prem 版本日志（93 篇）
  /release_notes\.md$/,           // 由 onprem 自动生成的总索引
  /[\\/]node_modules[\\/]/,
  /[\\/]\.git[\\/]/,
  /[\\/]\.cache[\\/]/,
];

function sha256File(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

function walk(dir, base) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.posix.join(base, e.name);
    if (e.isDirectory()) out.push(...walk(full, rel));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(rel);
  }
  return out;
}

function isExcluded(posixRel) {
  return EXCLUDE.some((re) => re.test('/' + posixRel));
}

function main() {
  const update = process.argv.includes('--update');
  const asJson = process.argv.includes('--json');

  const all = walk(SOURCE_ROOT, '').filter((f) => !isExcluded(f));
  // 排除语言目录自身（它们是译文，不是源）
  const sources = all.filter(
    (f) => !LANGS.some((l) => f === l || f.startsWith(l + '/'))
  );

  let status = {};
  if (fs.existsSync(STATUS_FILE)) {
    try {
      status = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
    } catch (e) {
      console.error('translation_status.json 解析失败，将重建。');
      status = {};
    }
  }

  const report = { missing: [], outdated: [], ok: [], summary: {} };

  for (const srcRel of sources) {
    const srcFull = path.join(SOURCE_ROOT, srcRel);
    const srcHash = sha256File(srcFull);
    for (const lang of LANGS) {
      const trFull = path.join(SOURCE_ROOT, lang, srcRel);
      const key = lang + ':' + srcRel;
      const rec = { file: srcRel, lang };

      if (!fs.existsSync(trFull)) {
        report.missing.push(srcRel);
        if (status[key]) delete status[key];
        continue;
      }

      const prev = status[key];
      if (!prev) {
        // 首次记录：视为已对齐
        report.ok.push(rec);
      } else if (prev.sourceHash !== srcHash) {
        report.outdated.push({ ...rec, prevSourceHash: prev.sourceHash });
      } else {
        report.ok.push(rec);
      }

      if (update) {
        status[key] = {
          sourceHash: srcHash,
          translatedHash: sha256File(trFull),
          updated: new Date().toISOString().slice(0, 10),
        };
      }
    }
  }

  report.summary = {
    totalSources: sources.length,
    ok: report.ok.length,
    missing: report.missing.length,
    outdated: report.outdated.length,
  };

  if (update) {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2) + '\n', 'utf8');
    console.log(
      `translation_status.json 已更新（${Object.keys(status).length} 条记录）。`
    );
  }

  if (asJson) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    console.log(`=== 翻译检查（语言: ${LANGS.join(', ')}）===`);
    console.log(
      `源文件: ${report.summary.totalSources} | 已译且最新: ${report.summary.ok} | 缺失: ${report.summary.missing} | 过期: ${report.summary.outdated}`
    );
    if (report.missing.length) {
      console.log('\n缺失 (missing):');
      report.missing.forEach((f) => console.log('  - ' + f));
    }
    if (report.outdated.length) {
      console.log('\n过期 (outdated):');
      report.outdated.forEach((o) => console.log(`  - ${o.file} (${o.lang})`));
    }
  }

  if (report.missing.length || report.outdated.length) process.exit(1);
}

main();
