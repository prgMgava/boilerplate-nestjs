# Logs

## Table of Contents <!-- omit in toc -->

- [General info](#general-info)
  - [Console Transport](#console-transport)
  - [File Transport](#file-transport)
  - [Custom Transport](#custom-transport)
    - [Log Tail Transport](#log-tail-transport)

---

## General info

We are using [Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/#getting-started-with-winston) package.
[Transports](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport) in Winston refer to the storage location for your log entries. Winston provides great flexibility in choosing where you want your log entries to be outputted to.

### Console Transport

By default boilerplate logs on console. The format of the logs can be configured, by default it is `{timestamp} [{label}] {level}: {message}`.

```mermaid
   2024-03-03T11:00:00 [AppName] error: OMG, something happened!!!
```

### File transport

By default boilerplate store logs into `src/logs` directory. Logging into files can quickly get out of hand if you keep logging to the same file as it can get extremely large and become cumbersome to manage. The main purpose of log **rotation** is to restrict the size of your log files and create new ones based on some predefined criteria

```mermaid
├── src
│   └── logs
│     └── error                             * Log level error.
│        └── log-2024-03-03.log
│        └── log-2024-03-04.log
│     └── info                              * Log level info.
│     └── combined                          * All log level.
```

## Custom Transport

Winston provide multiples custom transport. We are using LogTail that store only error level. But it was commented out because we leave you free to configure it if ou need.

## Log Tail Transport

1. [Set up your token on LogTail](https://logs.betterstack.com/team/0/sources?_gl=1*1gs0e7b*_ga*ODU2MDMyMDE0LjE3MDk3NDk0NzA.*_ga_9FLKD0MQYY*MTcwOTc1NDE5NS4yLjEuMTcwOTc1NzIxMi4wLjAuMA..*_gcl_au*MTYzMTY5MzQ3OC4xNzA5NzQ5NDcw)
2. Change `LOG_TAIL_TOKEN` in `.env`

   ```text
   LOG_TAIL_TOKEN=dYAGad4jD4q6Wsq9X3kAXsGi
   ```

Previous: [Automatic update of dependencies](automatic-update-dependencies.md)

Next: [Commits](commits.md)
