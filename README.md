# NestJS REST API boilerplate 🇺🇦

### This project was based on a [boilerplate](https://github.com/brocoders/nestjs-boilerplate) created by [Brocoders](https://github.com/brocoders).

[![image](https://github.com/brocoders/nestjs-boilerplate/assets/72293912/197da43e-02f4-4895-8d3e-b7a42a591c26)](https://github.com/new?template_name=nestjs-boilerplate&template_owner=brocoders)

![github action status](TODO:githubUrl/actions/workflows/docker-e2e.yml/badge.svg)
[![renovate](https://img.shields.io/badge/renovate-enabled-%231A1F6C?logo=renovatebot)](https://app.renovatebot.com/dashboard)
[![Static Badge](https://img.shields.io/badge/owner-brocoders-d91965?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTMwIiBoZWlnaHQ9IjE4NyIgdmlld0JveD0iMCAwIDEzMCAxODciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI%2BCjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF83NzExXzQ4OTEpIj4KPHBhdGggZD0iTTc1Ljk5NjcgNDUuNzUwNkM2NS4xMDg5IDQ2Ljg2MSA1Ny45MjMgNTguNDA5NyA2Mi4yNzgxIDY4Ljg0OEwxMDguNDQyIDE4N0w3My42MDEzIDE1NS4wMTlIMzQuODQwOUMyMC42ODY4IDE1NS4wMTkgOS4zNjM0OSAxNDMuNDcgOS4zNjM0OSAxMjkuMDM0Vjk0LjYxMDVDOS4zNjM0OSA5Mi4xNjc1IDguNDkyNDYgODkuNzI0NSA2Ljc1MDQyIDg3Ljk0NzdMMCA4MS4wNjNMNi43NTA0MiA3NC4xNzgxQzguNDkyNDYgNzIuNDAxNCA5LjM2MzQ5IDY5Ljk1ODQgOS4zNjM0OSA2Ny41MTU0VjMxLjA5MjZDOS4zNjM0OSAxMy43Njk2IDIzLjA4MjEgMCAzOS44NDkyIDBINTguMTQwN0w3NS45OTY3IDQ1Ljc1MDZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTI1LjY0NiAxMTIuMzc4Vjk0LjgzMjdDMTI1LjY0NiA5My43MjIyIDEyNi4wODEgOTIuNjExOCAxMjYuOTUyIDkxLjcyMzRMMTMwLjAwMSA4OC4zOTIxTDEyNi45NTIgODUuMDYwN0MxMjYuMDgxIDg0LjE3MjQgMTI1LjY0NiA4My4wNjE5IDEyNS42NDYgODEuOTUxNFY2OS43MzY1QzEyNS42NDYgNTYuNDExMSAxMTQuOTc2IDQ1Ljc1MDcgMTAyLjEyOCA0NS43NTA3SDc1Ljk5NzNMMTA1LjYxMiAxMzAuODExQzEwNS42MTIgMTMwLjgxMSAxMTAuNjIgMTMwLjgxMSAxMTAuODM4IDEzMC44MTFDMTE5LjExMyAxMjkuMDM1IDEyNS42NDYgMTIxLjQ4NCAxMjUuNjQ2IDExMi4zNzhaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c%2BCjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzc3MTFfNDg5MSI%2BCjxyZWN0IHdpZHRoPSIxMzAiIGhlaWdodD0iMTg3IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM%2BCjwvc3ZnPgo%3D&logoColor=d91965)](https://brocoders.com/)

## Description <!-- omit in toc -->

NestJS REST API boilerplate for typical project

[Full documentation here](/docs/readme.md)

Demo: TODO: deply demo

Frontend (React, Next.js): TODO: remote front end repo

## Table of Contents <!-- omit in toc -->

- [Features](#features)
- [Contributors](#contributors)

## Features

- [x] Database. Support [TypeORM](https://www.npmjs.com/package/typeorm) and [Mongoose](https://www.npmjs.com/package/mongoose).
- [x] Seeding.
- [x] Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)).
- [x] Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer)).
- [x] Sign in and sign up via email.
- [x] Social sign in (Apple, Facebook, Google, Twitter).
- [x] Admin and User roles.
- [x] Internationalization/Translations (I18N) ([nestjs-i18n](https://www.npmjs.com/package/nestjs-i18n)).
- [x] File uploads. Support local and Amazon S3 drivers.
- [x] [Swagger](https://docs.nestjs.com/openapi/introduction).
- [x] E2E and units tests using [Jest](https://jestjs.io/).
- [x] Docker.
- [x] Logging: using [winston](https://github.com/winstonjs/winston).
- [x] CI (Github Actions).
- [x] Integrated ESLint, Prettier and Husky
- [x] Followed SOLID Principles
- [x] Authentication and authorization: Cookie-based session
- [x] Compression: gzip compression with [compression](https://github.com/expressjs/compression)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/prgMgava"><img src="https://avatars.githubusercontent.com/u/78923115?v=4" width="100px;" alt="MGava Dev"/><br /><sub><b>MGava Dev</b></sub></a><br /><a href="#maintenance-Shchepotin" title="Maintenance">🚧</a> <a href="#doc-Shchepotin" title="Documentation">📖</a> <a href="#code-Shchepotin" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/brocoders"><img src="https://avatars.githubusercontent.com/u/1716664?s=200&v=4" width="100px;" alt="Brocoders"/><br /><sub><b>Brocoders</b></sub></a><br /><a href="#code-Brocoders" title="Owner">💎</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
