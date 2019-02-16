const difflib = require('difflib');
const request = require('request');
const reader = require('buffered-reader');
const DataReader = reader.DataReader;
const stringify = require('csv-stringify');
const h2p = require('html2plaintext');
const fs = require('fs');

sort = async (text, mode) => {
  return new Promise((resolve, reject) => {
    let osalista, cpoint;
    if (mode == 1) {
      osalista = text.split(' ');
      cpoint = 0.75;
    } else if (mode == 2) {
      osalista = text.split('.');
      cpoint = 0.7;
    }

    hakusana = [];
    maara = [];
    tulos = [];
    paikka = 0;
    templista = [];
    retest = [];

    for (let i = 0; i < osalista.length; i++) {
      let retest = difflib.getCloseMatches(osalista[i], hakusana, 1, cpoint);

      if (hakusana.indexOf(osalista[i]) > -1) {
        paikka = hakusana.indexOf(osalista[i]);
        maara[paikka] = maara[paikka] + 1;
      } else if (retest.length > 0) {
        paikka = hakusana.indexOf(retest[0]);
        maara[paikka] = maara[paikka] + 1;
      } else {
        hakusana.push(osalista[i]);
        maara.push(1);
      }
    }

    for (let i = 0; i < hakusana.length; i++) {
      tulos.push([hakusana[i], maara[i]]);
    }
    resolve(tulos);
  });
};

readUrls = () => {
  let urls = [];
  return new Promise((resolve, reject) => {
    new DataReader('./sources.txt', { encoding: 'utf8' })
      .on('error', function(error) {
        console.log('error: ' + error);
        reject();
      })
      .on('line', function(line) {
        urls.push(line);
      })
      .on('end', function() {
        resolve(urls);
      })
      .read();
  });
};

getPageContent = url => {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, body) {
      if (error) {
        reject();
      }

      resolve(body);
    });
  });
};

collectData = async urls => {
  const contents = [];

  await urls.map(url => contents.push(getPageContent(url)));
  return await Promise.all(contents);
};

stripHtmlTags = async htmls => htmls.map(page => h2p(page)).join(' ');

writeTmpFile = data => {
  fs.writeFile('texts.txt', data);
};

stripData = async data => {
  const upperCaseData = await data.toUpperCase();
  const stripped = await strip(upperCaseData);
  return await stripDic(stripped);
};

strip = data => data.replace(/[^A-Za-z0-9\. ?@#$%&*,]/g, '');

stripDic = data => {
  let listOfWords = data.split(' ');
  let dicWords = [];
  return new Promise((resolve, reject) => {
    new DataReader('./dict_FIN.txt', { encoding: 'utf8' })
      .on('error', function(error) {
        console.log('error: ' + error);
        reject();
      })
      .on('line', function(line) {
        dicWords.push(line);
      })
      .on('end', async () => {
        dicWords = dicWords
          .join(' ')
          .replace(/[0-9]/g, '')
          .split(' ')
          .filter(e => e.length > 0);
        listOfWords = listOfWords
          .filter(word => {
            return !dicWords.includes(word);
          })
          .join(' ');
        resolve(listOfWords);
      })
      .read();
  });
};

writeReport = (text, mode) => {
  const now = new Date();
  let logfile_name =
    './outputs/Info-' +
    now.getFullYear() +
    '-' +
    now.getMonth() +
    '-' +
    now.getDate();

  if (mode == 1) {
    logfile_name += '-words.csv';
  }
  if (mode == 2) {
    logfile_name += '-sentences.csv';
  }
  stringify(text, (err, output) => {
    if (err) throw err;
    fs.writeFile(logfile_name, output, err => {
      if (err) throw err;
      console.log(logfile_name + ' saved.');
    });
  });
};

main = async () => {
  const urls = await readUrls();
  console.log('collecting data');
  const htmls = await collectData(urls);
  const data = await stripHtmlTags(htmls);
  const stripped = await stripData(data);
  await writeTmpFile(stripped);
  console.log('data collected, analyzing');
  const results = await Promise.all([sort(stripped, 1), sort(stripped, 2)]);
  results.map((result, index) => writeReport(result, index + 1));
};
main();
