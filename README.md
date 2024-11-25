# Sanapolku

Coveralls test coverage

[![Coverage Status](https://coveralls.io/repos/github/koodikilpparit/sanapolku/badge.svg?branch=main)](https://coveralls.io/github/koodikilpparit/sanapolku?branch=main)

Link to the application page: https://koodikilpparit.github.io/sanapolku/#/

Sanapolku (Wordpath) is a game aimed to help with the treatment of aphasia patients. It utilizes the ACRT-method in a digital form. The player practices writing words with different paths. Game chooses randomly 10 words from the choosen path. There are two premade paths (for adults and children) and possibility to create custom paths. User can choose images for custom path's words from their own device or from Papunet image bank (https://kuvapankki.papunet.net/). Custom paths can be shared between devices. 

### Tools

The following tools are used with this project:
* JavaScript
* CSS & Tailwind
* Node & React
* Jest
* GitHub Pages
* Prettier
* ESLint

## How to run locally

To run this application you need to have Node installed. 

To run this application, first install NPM packages
```
  npm install
```

Then you can start the application with the following command
```
  npm start
```

The unit tests can be run with the following command
```
  npm test
```
or with the coveralls report
```
  npm test -- --coverage
```

The application can be checked with linting tool with the following command
```
  npm run lint
```

## License
This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
