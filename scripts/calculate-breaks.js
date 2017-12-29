const fs = require('fs');

const Parser = require('expr-eval').Parser;
const ss = require('simple-statistics');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const table2seq = require('../../s3-db-lambda-collate/reference/acs1115_table2seq.json');

const dataset = 'acs1115';

const datatree = {
    "acs1115": {
        "mhi": {
            "varcode": "mhi",
            "verbose": "Median Household Income",
            "section": "Income",
            "table": "B19013",
            "numerator": ["B19013001"],
            "denominator": [],
            "type": "currency",
            "minval": "1",
            "mininc": "1",
            "usezeroasnull": "yes",
            "favtable": "Median Household Income",
            "favstyle": "jenks,7,mh1",
            "bg": "yes"
        }

    }
};






Object.keys(datatree[dataset]).forEach(key => {

    const seq = table2seq[datatree[dataset][key].table].replace('eseq', '');
    const expression = getExpressionFromAttr(dataset, key);
    const parser = new Parser();
    const expr = parser.parse(expression.join(""));

    const expr_fields = getFields(dataset, key);

    console.log(expr_fields);

    console.log(expression);

    ["040"].forEach(sumlev => {

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

            console.log(valid_paths);

            valid_paths.forEach(valid_path => {

                const get_params = { Bucket: `s3db-${dataset}`, Key: valid_path };

                // get data matching key
                s3.getObject(get_params, function(err, data) {
                    if (err) {
                        return console.log(err, err.stack);
                    }

                    const result = JSON.parse(data.Body.toString());

                    const evaluated = {};

                    Object.keys(result).forEach(full_geoid => {
                        console.log(full_geoid);
                        const obj = {};
                        Object.keys(result[full_geoid]).forEach(field => {

                            if (expr_fields.includes(field)) {
                                console.log(field);
                                obj[field] = parseFloat(result[full_geoid][field]);
                            }

                        });
                        evaluated[full_geoid] = expr.evaluate(obj);
                        console.log(obj);

                    });

                    console.log(evaluated);

                });

            });

        });



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
