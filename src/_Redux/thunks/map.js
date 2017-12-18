/* global fetch*/

import { busyLoadingStyleData, finishedLoadingStyleData } from '../actions/map.js';

import { datatree } from '../../_Config_JSON/datatree.js';


export function thunkUpdateGeoids(geoids) {
    return (dispatch, getState) => {

        const source_dataset = getState().map.source_dataset;
        const attr = getState().buttonset.selected_attr;

        console.log('thunk');
        console.log(geoids);
        console.log(source_dataset);
        console.log(attr);

        dispatch(busyLoadingStyleData(true));

        fetch('https://kb7eqof39c.execute-api.us-west-2.amazonaws.com/dev/collate-s3-data', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "geoids": geoids, "expression": getExpressionFromAttr(attr), dataset: source_dataset })
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                const data = convertDataToStops(res);
                dispatch(finishedLoadingStyleData(data));
            });

    };
}

function getExpressionFromAttr(attr) {
    //
    return datatree.acs1115[attr.split('_')[1]].expression;
}

function convertDataToStops(data) {
    //
    return Object.keys(data).map(key => {
        return [key.split('US')[1], getStopColor(data[key])];
    });
}

function getStopColor(value) {
    //
    if (!value) {
        return 'black';
    }

    if (value > 100000) {
        return 'green';
    }
    else if (value > 60000) {
        return 'yellow';
    }
    else if (value > 40000) {
        return 'orange';
    }
    else {
        return 'red';
    }
}
