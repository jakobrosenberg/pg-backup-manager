import { resolve } from "path";
import { execSync } from "child_process";
import { logger } from "../utils.js";

export class Docker {
  /**
   * @param {import('../App.js').App} app
   */
  constructor(app) {
    this.app = app;
  }

  get _scripts() {
    const { db, password, host, user, dir, file, port } = this.app.options;
    const resolvedFolder = resolve(dir);
    return {
      docker: [
        "docker run",
        `-e PGDATABASE=${db}`,
        `-e PGPASSWORD=${password}`,
        `-e PGHOST=${host}`,
        `-e PGUSER=${user}`,
        `-e PGPORT=${port}`,
        "--rm",
        `-v ${resolvedFolder}:/backup`,
        '--network="host"',
        "postgres",
      ].join("   "),
      restore: `dropdb ${db}|| true && createdb && pg_restore -d ${db} /backup/${file}`,
      backup: `pg_dump -Ft  -f /backup/${file}`,
    };
  }

  _runScript(script) {
    try {
      logger.debug(script.replace(/ {2} +/g, "\\\r\n  "));
      const res = execSync(script.replace(/DELIM/g, " ")).toString();
      if (res) logger.log("Docker output:", res);
    } catch (err) {
      logger.error("Could not run command", script);
    }
  }

  backup() {
    return this._runScript(`${this._scripts.docker} ${this._scripts.backup}`);
  }

  restore() {
    return this._runScript(`${this._scripts.docker} bash -c "${this._scripts.restore}"`);
  }
}
