# pg-backup-manager

A Backup manager for postgres.

### Adapters

- Docker [DONE]
- Native [TBD]
- JS [TBD]

### Usage

```
pg-backup-manager [action] [options]
```

Where `action` is one of the following: `['backup', 'restore']`

### Options

```
-m, --mode <mode>     which adapter to use, docker, native, js (defaults to ${defaults.mode})
-h, --host <host>     postgres host (defaults to localhost)
-P, --port <port>     postgres port (defaults to 5432)
-u, --user <user>     postgres user (defaults to '')
-p, --password <password>  postgres password (defaults to '')
-d, --db <database>   postgres database (defaults to '')
-d, --dir <directory> the backup directory (defaults to '')
-f, --file <filename> the backup filename (supports $time, $db and $latest) (defaults to $db-$time.sql)
-c, --config <filepath> the config file to use (defaults to pg-backup-manager.json)
-l, --log-level <number> the log level (defaults to 3)
```

### Config file with defaults

```json
{
  "host": "localhost",
  "port": "5432",
  "user": "",
  "password": "",
  "db": "",
  "dir": ".pg-backups",
  "file": "$db-$time.sql",
  "config": "",
  "mode": "docker",
  "logLevel": 3
}
```

### Examples

To backup using the defaults:
```
pg-backup-manager backup
```

To backup a database using custom options:
```
pg-backup-manager backup -m docker -h my-db-host -P 5432 -u myuser -p mypassword -d mydb -d /backups -f backup-$db-$time.sql
```

License
This project is licensed under the MIT License.