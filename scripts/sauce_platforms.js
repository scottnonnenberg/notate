/* eslint-disable camelcase */

import fs from 'fs';
import { oneLine } from 'common-tags';

import superagent from 'superagent';
import _ from 'lodash';
import config from 'config';


function getPlatforms(options, cb) {
  const { username, key } = options;
  const target = 'https://saucelabs.com/rest/v1/info/platforms/webdriver';

  superagent
    .get(target)
    .auth(username, key)
    .end((err, res) => {
      if (err) {
        return cb(err);
      }

      return cb(null, res.body);
    });
}

function displayPlatforms(platforms) {
  // eliminate any weird dev/beta versions
  const clean = _.chain(platforms)
    .reject(platform =>
      isNaN(platform.short_version = parseFloat(platform.short_version))
    )
    .orderBy(['api_name', 'short_version', 'os'], ['asc', 'desc', 'asc'])
    .map(platform => oneLine`
      ['${platform.os}', '${platform.api_name}', '${platform.short_version}']
      (${platform.long_name}, ${platform.long_version})
    `)
    .value();

  console.log(clean.join('\n'));
}

const command = process.argv[2];
const file = 'sauce_platforms.json';
const options = config.get('sauce');

if (command === 'get') {
  getPlatforms(options, (err, platforms) => {
    if (err) {
      console.error(err.stack);
      process.exitCode = 1;
      return;
    }

    fs.writeFileSync(file, JSON.stringify(platforms));
  });
}
else {
  const contents = fs.readFileSync(file);
  const platforms = JSON.parse(contents.toString());

  displayPlatforms(platforms);
}

