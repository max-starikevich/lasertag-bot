# Telegram bot for Lasertag community

Meant to automate some daily functions around Google Spreadsheet file, which we use to prepare a playerlist and other stuff.

## Contributing

Pull requests and issues are welcomed.

To contribute to this project, you need to have:

- Node.js, Yarn installed
- Ngrok, since we use webhooks even in local development
- Telegram account
- Bot account created by BotFather: https://core.telegram.org/bots#3-how-do-i-create-a-bot
- A new Google Cloud project with Sheets API permission: https://cloud.google.com/resource-manager/docs/creating-managing-projects

Next, open two separate terminal windows and run:

```console
$ ngrok http 4000
```

```console
$ yarn install
$ cp .env.example .env # use the data from Ngrok, BotFather and Google Cloud console
$ yarn start
```

Have fun!
