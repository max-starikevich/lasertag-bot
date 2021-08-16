# Telegram bot for our local Lasertag community

Meant to automate some daily functions, like add yourself to the playerlist (Google Spreadsheets).

# Quick start

You will need Node.js 16, yarn and ngrok installed.

```console
$ ngrok http 4000 # copy generated ngrok domain to .env#HOOK_DOMAIN
```

```console
$ yarn install
$ cp .env.example .env # adjust .env
$ yarn start
```
