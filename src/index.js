/* eslint-disable import/no-commonjs */

import { default as notate, justNotate, prettyPrint } from './notate';

module.exports = notate;

notate.justNotate = justNotate;
notate.prettyPrint = prettyPrint;
notate.notate = notate;
