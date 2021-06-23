# Installation

```bash
$ git clone https://github.com/vladbarcelo/ts-crypto-test.git
$ npm i
$ npm run build
$ cp .env.example .env
# Don't forget to enter your API key in .env
```

# Usage

```bash
$ node dist/app.js --value=10 --from=BTC --to=USD
# 340162.75
# You can also select the digit count
$ node dist/app.js --value=10 --from=BTC --to=USD --digits=4
# 340162.7590
```