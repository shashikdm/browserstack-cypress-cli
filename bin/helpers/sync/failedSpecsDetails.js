const tablePrinter = require('table'), // { table, getBorderCharacters }
      chalk = require('chalk'),
      Constants = require("../constants"),
      logger = require("../logger").syncCliLogger;

/**
 *
 * @param {Array.<{specName: string, status: string, combination: string, sessionId: string}>} data
 * @returns {Promise.resolve || Promise.reject}
 */
// Example:
// [
//   {specName: 'spec1.failed.js', status: 'Failed', combination: 'Win 10 / Chrome 78', sessionId: '3d3rdf3r...'},
//   {specName: 'spec2.name.js', status: 'Skipped', combination: 'Win 10 / Chrome 78', sessionId: '3d3rdf3r...'},
//   {specName: 'spec3.network.js', status: 'Failed', combination: 'Win 10 / Chrome 78', sessionId: '3d3rdf3r...'},
//   {specName: 'spec6.utils.js', status: 'Failed', combination: 'Win 10 / Chrome 78', sessionId: '3d3rdf3r...'},
//   {specName: 'spec8.alias.js', status: 'Skipped', combination: 'Win 10 / Chrome 78', sessionId: '3d3rdf3r...'}
// ]
//
let failedSpecsDetails = (data) => {
  return new Promise((resolve, reject) => {
    if (data.length === 0) resolve(0); // return if no failed/skipped tests.

    let failedSpecs = false;
    let specResultHeader = Constants.syncCLI.FAILED_SPEC_DETAILS_COL_HEADER.map((col) => {
      return chalk.blueBright(col);
    });

    let specData = [specResultHeader]; // 2-D array

    data.forEach((spec) => {
      if (spec.status.toLowerCase() === 'passed') {
        return;
      }
      if (spec.status && spec.status.toLowerCase() === 'failed' && !failedSpecs)
        failedSpecs = true;

      let specStatus = (spec.status && spec.status.toLowerCase() === 'failed') ?
                          chalk.red(spec.status) : chalk.yellow(spec.status);
      specData.push([spec.specName, specStatus, spec.combination, spec.sessionId]);
    });

    let config = {
      border: tablePrinter.getBorderCharacters('ramac'),
      columns: {
        0: { alignment: 'left' },
        1: { alignment: 'left' },
        2: { alignment: 'left' },
        3: { alignment: 'left' },
      },
      /**
      * @typedef {function} drawHorizontalLine
      * @param {number} index
      * @param {number} size
      * @return {boolean}
      */
      drawHorizontalLine: (index, size) => {
        return (index === 0 || index === 1 ||  index === size);
      }
    }

    let result = tablePrinter.table(specData, config);

    logger.info('Failed / skipped test report');
    logger.info(result);

    if (failedSpecs) reject(1); // specs failed, send exitCode as 1
    resolve(0); // No Specs failed, maybe skipped, but not failed, send exitCode as 0
  });
}

exports.failedSpecsDetails = failedSpecsDetails;