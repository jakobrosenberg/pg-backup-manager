/// <reference path="./models.d.ts" />
import { readFileSync } from "fs";

const defaultCfgPath = "pg-backup-manager.json";

export const defaults = {
  host: "localhost",
  port: "5432",
  user: "",
  password: "",
  db: "",
  dir: ".pg-backups",
  file: "$db-$time.sql",
  config: "",
  mode: "docker",
  logLevel: 3
};

/**
 * @param {string} path
 * @returns {Partial<Options>}
 */
export const getLocal = (path) => {
  try {
    return JSON.parse(readFileSync(path || defaultCfgPath, "utf-8"));
  } catch (err) {
    if (path || err.code !== "ENOENT") {
      console.log(`Failed to load config: "${path || defaultCfgPath}"`);
      throw new Error(err);
    }
    return {};
  }
};

export const getLocalDefaults = (path) => ({ ...defaults, ...getLocal(path) });
