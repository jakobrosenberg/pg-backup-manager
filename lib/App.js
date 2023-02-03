/// <reference path="./models.d.ts" />

import { adapters } from "./adapters/index.js";
import { defaults, getLocal } from "./options.js";
import { resolve } from "path";
import { getFileSizeInKb, getLastFileThatMatches, logger, prettyDate } from "./utils.js";

const dateRegex = '\\d{4}-\\d{2}-\\d{2}_\\d{2}_\\d{2}_\\d{2}'

export class App {
  /**
   *
   * @param {Options} input
   */
  constructor(input) {
    const configFile = getLocal(input.config || defaults.config);
    this.options = { ...defaults, ...configFile, ...input };
    this.options.file = this.options.file
      .replace(/\$db/g, this.options.db)
      .replace(/\$time/g, () => prettyDate(new Date()))
      .replace(/.*\$latest.*/, (str) => {
        const file = getLastFileThatMatches(this.options.dir, new RegExp("^" + str.replace(/\$latest/, dateRegex) + "$"));
        if (!file) {
          console.log("No file matches", str);
          process.exit(1);
        } else return file;
      });

    logger.level = Number(this.options.logLevel);

    if (!this.options.db || !this.options.user || !this.options || !this.options.password) {
      console.log("incorrect input", this.options);
      process.exit();
    }

    this.adapter = new adapters[input.mode](this);
  }

  getResolvedFile() {
    return resolve(this.options.dir, this.options.file);
  }

  async backup() {
    const time = Date.now();
    await this.adapter.backup();
    logger.log(`Backed up "${this.options.db}" to ${this.getResolvedFile()}`);
    logger.log(`Size: ${getFileSizeInKb(this.getResolvedFile())} kb, duration: ${Date.now() - time} ms`);
  }
  async restore() {
    const time = Date.now();
    await this.adapter.restore();
    logger.log(`Restored "${this.options.db}" from ${this.getResolvedFile()}`);
    logger.log(`Size: ${getFileSizeInKb(this.getResolvedFile())} kb, duration: ${Date.now() - time} ms`);
  }
}
