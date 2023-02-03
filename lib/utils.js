import { readdirSync, statSync } from "fs";
import { createLogger } from "consolite";

export const getFileSizeInKb = (file) => {
  return (statSync(file).size / 1024).toString();
};

/**
 * Returns the filename of
 * @param {string} dir
 * @param {RegExp} regex
 * @returns {string|undefined}
 */
export const getLastFileThatMatches = (dir, regex) =>
  readdirSync(dir)
    .filter((file) => file.match(regex))
    .sort()
    .pop();

export const logger = createLogger("[pg-backup-manager]");

export const prettyDate = (date) => date.toISOString().substring(0, 19).replace(/[T:]/g, "_");
