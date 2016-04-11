import fs from 'fs';

import superagent from 'superagent';
import _ from 'lodash';
import config from 'config';


function getPlatforms(options, cb) {
  const {username, key} = options;
  const target = 'https://saucelabs.com/rest/v1/info/platforms/webdriver';

  superagent
    .get(target)
    .auth(username, key)
    .end(function(err, res) {
      if (err) {
        return cb(err);
      }

      return cb(null, res.body);
    });
}

function displayPlatforms(platforms) {
  // eliminate any weird dev/beta versions
  platforms = _.reject(platforms, platform => isNaN(platform.short_version = parseFloat(platform.short_version)));


  platforms = _.orderBy(platforms, ['api_name', 'short_version', 'os'], ['asc', 'desc', 'asc']);

  platforms = _.map(platforms, function(platform) {
    return `['${platform.os}', '${platform.api_name}', '${platform.short_version}']` +
      ` (${platform.long_name}, ${platform.long_version})`;
  });

  console.log(platforms.join('\n'));
}

const command = process.argv[2];
const file = 'sauce_platforms.json';
const options = config.get('sauce');

if (command === 'get') {
  getPlatforms(options, function(err, platforms) {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }

    fs.writeFileSync(file, JSON.stringify(platforms));
  });
}
else {
  const contents = fs.readFileSync(file);
  const platforms = JSON.parse(contents.toString());

  displayPlatforms(platforms);
}

