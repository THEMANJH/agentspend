#!/usr/bin/env node
"use strict";

/**
 * AgentSpend uploader.
 *
 * Reads local Claude Code session logs (~/.claude/projects/**\/*.jsonl),
 * extracts ONLY the `usage` metadata Claude Code already writes there
 * (token counts, model name, timestamp) plus the project folder's base
 * name, and posts that to your team's AgentSpend dashboard.
 *
 * It never reads message content, prompts, file diffs, or tool output.
 * Run with --dry-run to see exactly what would be sent without sending it.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const readline = require("readline");

function parseArgs(argv) {
  const args = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--key") args.teamKey = argv[++i];
    else if (a === "--member") args.member = argv[++i];
    else if (a === "--endpoint") args.endpoint = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function printHelp() {
  console.log(`agentspend-upload — sync Claude Code usage metadata to AgentSpend

Usage:
  agentspend-upload --key <team-key> [--member <label>] [--dry-run]

Options:
  --key <key>       Team ingest key from your AgentSpend dashboard
                     (or set AGENTSPEND_TEAM_KEY)
  --member <label>  Label for this machine/person (default: OS username)
  --endpoint <url>  Override the ingest URL (default: AgentSpend's API,
                     or set AGENTSPEND_ENDPOINT)
  --dry-run         Print what would be uploaded without sending anything
  --help            Show this message

Privacy: only token counts, model name, project folder name, and
timestamps are read from your local logs. Prompt text, file contents,
and diffs are never touched.`);
}

function findJsonlFiles(rootDir) {
  const results = [];
  let projectDirs;
  try {
    projectDirs = fs.readdirSync(rootDir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of projectDirs) {
    if (!entry.isDirectory()) continue;
    const projectPath = path.join(rootDir, entry.name);
    let files;
    try {
      files = fs.readdirSync(projectPath);
    } catch {
      continue;
    }
    for (const f of files) {
      if (f.endsWith(".jsonl")) results.push(path.join(projectPath, f));
    }
  }
  return results;
}

function loadState(statePath) {
  try {
    return JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch {
    return {};
  }
}

function saveState(statePath, state) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

async function extractNewEvents(filePath, alreadyProcessedLines) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  const events = [];
  let lineNo = 0;
  for await (const line of rl) {
    lineNo++;
    if (lineNo <= alreadyProcessedLines) continue;
    if (!line.trim()) continue;

    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    const usage = entry?.message?.usage;
    if (!usage) continue;

    const projectLabel = entry.cwd ? path.basename(entry.cwd) : "unknown-project";
    events.push({
      occurred_at: entry.timestamp || new Date().toISOString(),
      project_label: projectLabel,
      model: entry.message?.model || "unknown",
      input_tokens: usage.input_tokens || 0,
      output_tokens: usage.output_tokens || 0,
      cache_read_tokens: usage.cache_read_input_tokens || 0,
      cache_creation_tokens: usage.cache_creation_input_tokens || 0,
    });
  }

  return { events, totalLines: lineNo };
}

async function postBatch(endpoint, teamKey, member, events) {
  const CHUNK = 200;
  let inserted = 0;
  for (let i = 0; i < events.length; i += CHUNK) {
    const chunk = events.slice(i, i + CHUNK);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamKey, member, events: chunk }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`upload failed (${res.status}): ${text}`);
    }
    const json = await res.json();
    inserted += json.inserted || 0;
  }
  return inserted;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const teamKey = args.teamKey || process.env.AGENTSPEND_TEAM_KEY;
  const member = args.member || os.userInfo().username;
  const endpoint =
    args.endpoint || process.env.AGENTSPEND_ENDPOINT || "https://agentspend.dev/api/ingest";

  if (!teamKey && !args.dryRun) {
    console.error("Missing team key. Pass --key <key> or set AGENTSPEND_TEAM_KEY.");
    console.error("Run with --dry-run to preview without a key.");
    process.exit(1);
  }

  const claudeProjectsDir = path.join(os.homedir(), ".claude", "projects");
  const statePath = path.join(os.homedir(), ".agentspend", "state.json");
  const state = loadState(statePath);

  const files = findJsonlFiles(claudeProjectsDir);
  if (files.length === 0) {
    console.log(`No Claude Code session logs found under ${claudeProjectsDir}`);
    return;
  }

  const allNewEvents = [];
  const newLineCounts = {};

  for (const file of files) {
    const alreadyProcessed = state[file] || 0;
    const { events, totalLines } = await extractNewEvents(file, alreadyProcessed);
    if (events.length > 0) allNewEvents.push(...events);
    newLineCounts[file] = totalLines;
  }

  if (allNewEvents.length === 0) {
    console.log("Nothing new to sync.");
    return;
  }

  console.log(`Found ${allNewEvents.length} new usage event(s) across ${files.length} log file(s).`);

  if (args.dryRun) {
    console.log("\n--dry-run: nothing was sent. Sample of what would be uploaded:\n");
    console.log(JSON.stringify(allNewEvents.slice(0, 5), null, 2));
    if (allNewEvents.length > 5) console.log(`...and ${allNewEvents.length - 5} more.`);
    return;
  }

  const inserted = await postBatch(endpoint, teamKey, member, allNewEvents);
  Object.assign(state, newLineCounts);
  saveState(statePath, state);
  console.log(`Synced ${inserted} event(s) to AgentSpend as "${member}".`);
}

main().catch((err) => {
  console.error("agentspend-upload error:", err.message);
  process.exit(1);
});
