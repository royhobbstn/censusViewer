// node version 9
// node --experimental-modules calculate-breaks.mjs

import { configuration } from '../src/_Config_JSON/configuration.mjs';
import { datatree } from '../src/_Config_JSON/datatree.mjs';
import table2seq from '../../s3-db-lambda-collate/reference/acs1115_table2seq.json';

import fs from 'fs';
import ee from 'expr-eval';
import ss from 'simple-statistics';
import AWS from 'aws-sdk';
import rp from 'request-promise';

const Parser = ee.Parser;
const s3 = new AWS.S3();


const dataset = 'acs1115';
const SAMPLE_LIMIT = 200;
const obj = {};


const each_key_promise = Object.keys(datatree[dataset]).map(key => {

    return new Promise((resolve_top, reject_top) => {

        const seq = table2seq[datatree[dataset][key].table].replace('eseq', '');
        const expression = getExpressionFromAttr(dataset, key);
        const parser = new Parser();
        const expr = parser.parse(expression.join(""));
        const expr_fields = getFields(dataset, key);


        const summary_levels = ["040", "050", "140", "150", "160"].map(sumlev => {

            return new Promise((resolve, reject) => {
                const valid_paths = [];

                const params = {
                    Bucket: `s3db-${dataset}`,
                    Delimiter: '/',
                    Prefix: `e${seq}/${sumlev}/`
                };

                // get list of objects matching seq and sumlev
                s3.listObjects(params, function(err, data) {
                    if (err) throw err;

                    data.Contents.forEach(path => {
                        valid_paths.push(path.Key);
                    });

                    const getMatchingData = valid_paths.slice(0, SAMPLE_LIMIT).map(valid_path => {
                        // get data matching key (from CDN)
                        return rp(`https://${getUrlFromDataset(dataset)}/${valid_path}`);
                    });

                    Promise.all(getMatchingData).then(response => {

                        const evaluated = {};
                        const stat_array = [];

                        response.forEach(data => {
                            const result = JSON.parse(data);

                            Object.keys(result).forEach(full_geoid => {
                                const mobj = {};
                                Object.keys(result[full_geoid]).forEach(field => {

                                    if (expr_fields.includes(field)) {
                                        mobj[field] = parseFloat(result[full_geoid][field]);
                                    }

                                });
                                evaluated[full_geoid] = expr.evaluate(mobj);
                                stat_array.push(expr.evaluate(mobj));

                            });

                        });


                        if (obj[key] === undefined) {
                            obj[key] = {};
                        }

                        obj[key][sumlev] = calcBreaks(stat_array);
                        resolve('done');
                    });

                });

            });

        });

        Promise.all(summary_levels).then(msg => {
            console.log('geo levels: ' + msg.length);
            resolve_top('finished');
        });

    });

});


Promise.all(each_key_promise).then(data => {
    console.log('keys: ' + data.length);

    var output = 'export default ' + JSON.stringify(obj) + ';';

    fs.writeFile(`../src/_Config_JSON/breaks_${dataset}.js`, output, function(err) {
        if (err) {
            throw err;
        }
        console.log('The file has been saved!');
    });

});



function getExpressionFromAttr(dataset, attr) {
    const numerator_raw = datatree[dataset][attr].numerator;
    const denominator_raw = datatree[dataset][attr].denominator;

    const numerator = [];
    numerator_raw.forEach((item, index) => {
        numerator.push(item);
        if (index !== numerator_raw.length - 1) { numerator.push("+"); }
    });

    const denominator = [];
    denominator_raw.forEach((item, index) => {
        denominator.push(item);
        if (index !== denominator_raw.length - 1) { denominator.push("+"); }
    });
    if (!denominator.length) {
        denominator.push("1");
    }

    return ["(", ...numerator, ")", "/", "(", ...denominator, ")"];
}

function getFields(dataset, attr) {
    const numerator = datatree[dataset][attr].numerator;
    const denominator = datatree[dataset][attr].denominator;
    return [...numerator, ...denominator];
}

function calcBreaks(data) {

    // convert all data to numbers
    var thedata = data.filter(d => {
            return !Number.isNaN(d);
        })
        .map(function(d) {
            return Number(d);
        });


    var max = ss.max(thedata);

    // all values in array are 0. (presumably no bg data)  Add a '1' to the array so simplestatistics library doesnt fail computing ckmeans.
    if (max === 0) {
        thedata = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    }

    var min = ss.min(thedata);
    var median = ss.median(thedata);
    var stddev = ss.standardDeviation(thedata);

    var ckmeans5 = ss.ckmeans(thedata, 5);
    var ckmeans7 = ss.ckmeans(thedata, 7);
    var ckmeans9 = ss.ckmeans(thedata, 9);

    var computed_breaks = {};
    computed_breaks.ckmeans5 = [ckmeans5[4][0], ckmeans5[3][0], ckmeans5[2][0], ckmeans5[1][0]];
    computed_breaks.ckmeans7 = [ckmeans7[1][0], ckmeans7[2][0], ckmeans7[3][0], ckmeans7[4][0], ckmeans7[5][0], ckmeans7[6][0]];
    computed_breaks.ckmeans9 = [ckmeans9[8][0], ckmeans9[7][0], ckmeans9[6][0], ckmeans9[5][0], ckmeans9[4][0], ckmeans9[3][0], ckmeans9[2][0], ckmeans9[1][0]];
    computed_breaks.stddev7 = [median + (stddev * 1.5), median + stddev, median + (stddev * 0.5), median, median - (stddev * 0.5), median - stddev, median - (stddev * 1.5)];
    computed_breaks.stddev8 = [median + (stddev * 2.5), median + (stddev * 1.5), median + (stddev * 0.5), median - (stddev * 0.5), median - (stddev * 1.5), median - (stddev * 2.5)];
    computed_breaks.quantile5 = [ss.quantile(thedata, 0.8), ss.quantile(thedata, 0.6), ss.quantile(thedata, 0.4), ss.quantile(thedata, 0.2)];
    computed_breaks.quantile7 = [ss.quantile(thedata, 0.857143), ss.quantile(thedata, 0.714286), ss.quantile(thedata, 0.57143), ss.quantile(thedata, 0.42857), ss.quantile(thedata, 0.28571), ss.quantile(thedata, 0.14286)];
    computed_breaks.quantile9 = [ss.quantile(thedata, 0.88888), ss.quantile(thedata, 0.77777), ss.quantile(thedata, 0.66666), ss.quantile(thedata, 0.55555), ss.quantile(thedata, 0.44444), ss.quantile(thedata, 0.33333), ss.quantile(thedata, 0.22222), ss.quantile(thedata, 0.11111)];
    computed_breaks.quantile11 = [ss.quantile(thedata, 0.90909), ss.quantile(thedata, 0.81818), ss.quantile(thedata, 0.72727), ss.quantile(thedata, 0.63636), ss.quantile(thedata, 0.54545), ss.quantile(thedata, 0.45454), ss.quantile(thedata, 0.36364), ss.quantile(thedata, 0.27273), ss.quantile(thedata, 0.18182), ss.quantile(thedata, 0.09091)];
    computed_breaks.min = min;
    computed_breaks.max = max;
    computed_breaks.mean = ss.mean(thedata);
    computed_breaks.median = median;
    computed_breaks.stddev = stddev;

    return computed_breaks;
}


function getUrlFromDataset(dataset) {
    switch (dataset) {
        case 'acs1014':
        case 'acs1115':
        case 'acs1216':
            return configuration.datasets[dataset].cdn;
        default:
            console.error('unknown dataset');
            return 'maputopia.com';
    }
}
