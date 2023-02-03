#!/usr/bin/env node

import { Command, createCommand, createOption } from "commander";
import { App } from "./App.js";
import { getLocalDefaults } from "./options.js";

const allowedActions = ["backup", "restore"];
let defaults = getLocalDefaults();

const argIndex = process.argv.findIndex((str) => ["-c", "--config"].includes(str));
const configFile = ~argIndex ? process.argv[1 + argIndex] : defaults.config;
if (configFile) defaults = { ...defaults, ...getLocalDefaults(configFile) };

const program = new Command();

program
  .name("pg-backup-manager")
  .description("Backup manager for postgres")
  //   .version(readSyn('../package.json').version);
  .argument("[action]", `action <${allowedActions.join("|")}>`)
  .option("-m, --mode <mode>", "which adapter to use, docker, native, js", defaults.mode)
  .option("-h, --host <host>", "postgres host", defaults.host)
  .option("-P, --port <port>", "postgres port", defaults.port)
  .option("-u, --user <user>", "postgres user", defaults.user)
  .option("-p, --password <password>", "postgres password", defaults.password)
  .option("-d, --db <database>", "postgres database", defaults.db)
  .option("-d, --dir <directory>", "the backup directory", defaults.dir)
  .option("-f, --file <filename>", "the backup filename (supports $time, $db and $latest)", defaults.file)
  .option("-c, --config <filepath>", "the config file to use", defaults.config)
  .option("-l, --log-level <number>", "the log level, defaults to 3", defaults.logLevel.toString())
  .action((action, options) => {
    const app = new App(options);
    if (action) {
      if (!allowedActions.includes(action)) {
        console.log(`"${action}" is not an allowed action.`);
        process.exit(1);
      }
      app[action]();
    }
  });

program.parse();
