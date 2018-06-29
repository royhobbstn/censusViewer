// node version 9
// node --experimental-modules calculate-breaks.mjs

const fs = require('fs');
const ss = require("simple-statistics");
const rp = require('request-promise');
const Parser = require('expr-eval').Parser;

const dataset = 'acs1115';

const datatree = require(`../src/_Config_JSON/${dataset}_tree.json`);


const data_store = {};

const keys = [];

Object.keys(datatree).slice(0, 1).map(attr => {
  ['040', '050', '140', '150', '160'].forEach(sumlev => {
    keys.push({ attr, sumlev });
  });
});

console.log(keys);

const lookups = keys.map(item => {

  return new Promise((resolve, reject) => {


    const expression = getExpressionFromAttr(datatree, item.attr);

    const sumlev = item.sumlev;
    const url = getUrlFromDataset(dataset);


    const fields = Array.from(new Set(getFieldsFromExpression(expression)));

    const parser = new Parser();
    const expr = parser.parse(expression.join(""));

    const datas = [];
    const fields_key = [];

    fields.forEach(field => {
      fields_key.push(field);
      datas.push(rp({
        method: 'get',
        uri: `https://${url}/${field}/${sumlev}.json`,
        headers: {
          'Accept-Encoding': 'gzip',
        },
        gzip: true,
        json: true,
        fullResponse: false
      }));
    });

    Promise.all(datas).then(data => {

      const combined_data = [];

      // create a data structure where combined_data indexes match fields indexes
      fields_key.forEach((field_key, field_key_index) => {
        fields.forEach((field, i) => {
          if (field_key === field) {
            if (combined_data[i]) {
              combined_data[i] = Object.assign({}, combined_data[i], data[field_key_index]);
            }
            else {
              combined_data[i] = data[field_key_index];
            }
          }
        });
      });

      const evaluated = {};

      // combined_data[0] index is arbitrary.  goal is just to loop through all geoids
      // create a mini object where each object key is a field name.
      // then solve the expression, and record the result in a master 'evaluated' object
      Object.keys(combined_data[0]).forEach(geoid => {
        const obj = {};
        fields.forEach((field, i) => {
          obj[field] = combined_data[i][geoid];
        });
        evaluated[geoid] = expr.evaluate(obj);
      });

      // store in main data object
      if (!data_store[item.attr]) {
        data_store[item.attr] = {};
      }

      data_store[item.attr][item.sumlev] = calcBreaks(evaluated);

      resolve('done');

    }).catch(err => {
      console.log(err);
    });


  });

});


Promise.all(lookups).then(() => {
    fs.writeFileSync('./test.json', JSON.stringify(data_store), 'utf8');
  })
  .catch(err => {
    console.log(err);
  });



function calcBreaks(data) {

  // convert all data to numbers
  let thedata = Object.keys(data).filter(key => {
      return !Number.isNaN(data[key]);
    })
    .map(function(d) {
      return Number(d);
    });


  const max = ss.max(thedata);

  // all values in array are 0. (presumably no bg data)  Add a '1' to the array so simplestatistics library doesnt fail computing ckmeans.
  if (max === 0) {
    thedata = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  }

  const min = ss.min(thedata);
  const median = ss.median(thedata);
  const stddev = ss.standardDeviation(thedata);

  const ckmeans5 = ss.ckmeans(thedata, 5);
  const ckmeans7 = ss.ckmeans(thedata, 7);
  const ckmeans9 = ss.ckmeans(thedata, 9);

  const computed_breaks = {};
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



function getExpressionFromAttr(dataset, attr) {
  const numerator_raw = dataset[attr].numerator;
  const denominator_raw = dataset[attr].denominator;

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




function getFieldsFromExpression(expression) {
  return expression.filter(d => {
    return d.length > 1;
  });
}

function getUrlFromDataset(dataset) {

  switch (dataset) {
    case 'acs1014':
      return `s3-us-west-2.amazonaws.com/s3db-acs-1014`;
    case 'acs1115':
      return `s3-us-west-2.amazonaws.com/s3db-acs-1115`;
    case 'acs1216':
      return `s3-us-west-2.amazonaws.com/s3db-acs-1216`;
    default:
      console.error('unknown dataset');
      return 'maputopia.com';
  }
}
