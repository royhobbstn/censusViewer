/* global fetch*/

import { busyLoadingStyleData, finishedLoadingStyleData } from '../actions/a_map.js';

import { datatree } from '../../_Config_JSON/datatree.js';
import localforage from "localforage";


localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'CensusWebmap'
});

window.llstore = {};

export function thunkUpdateGeoids(geoids) {
    return (dispatch, getState) => {

        const state = getState();
        const is_busy = state.map.is_busy;

        if (is_busy) {
            console.log('map is busy');
            return;
        }


        dispatch(busyLoadingStyleData(true));

        const source_dataset = state.map.source_dataset;
        const sumlev = getSumlevFromGeography(state.map.source_geography);
        const attr = state.map.selected_attr;

        const attr_short = attr.split('_')[1];

        var t0 = performance.now();

        // convert geoids queried from the screen to a unique key that can be stored in memory
        const formatted_ids = geoids.map(id => {
            return `${source_dataset}:${attr_short}:${sumlev}00US${id}`;
        });

        // get the value of that unique key (pulling from memory)
        const value_store = formatted_ids.map(pr => {
            return window.llstore[pr];
        });

        const key_with_value = {};
        const no_value = [];

        // for each geoid, if it has a value, put it into a 'has value' object
        // if it doesn't have a value, it will need to be looked up via ajax
        // so put it into an array of geoids to find later
        formatted_ids.forEach((geoid, index) => {
            if (value_store[index] === undefined) {
                no_value.push(geoid.split(':')[2].slice(7));
            }
            else {
                key_with_value[geoid] = value_store[index];
            }
        });

        var t2 = performance.now();

        console.log("Call to doSomething took " + (t2 - t0) + " milliseconds.");

        fetchRemoteData(no_value, attr, attr_short, source_dataset).then(data => {

            // combine the values we already have locally, with those we just found via ajax
            const results = Object.assign({}, key_with_value, data);

            // convert the raw numbers to colors for styling
            const all_data = convertDataToStops(results);

            // prevent this dispatch when no new data of value
            dispatch(finishedLoadingStyleData(all_data));


        });


    };
}

// call to lambda functions to retrieve data
function fetchRemoteData(geoids, attr, attr_short, source_dataset) {
    if (geoids.length === 0) {
        return Promise.resolve({});
    }

    return fetch('https://kb7eqof39c.execute-api.us-west-2.amazonaws.com/dev/collate-s3-data', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "geoids": geoids, "expression": getExpressionFromAttr(attr), dataset: source_dataset, e_or_m: 'e' })
        })
        .then(res => res.json())
        .then(res => {
            console.log('returned from ajax call');

            // cache value in memory and create data return object
            const fetched_data = {};
            Object.keys(res).forEach(key => {
                window.llstore[`${source_dataset}:${attr_short}:${key}`] = res[key];
                fetched_data[`${source_dataset}:${attr_short}:${key}`] = res[key];
            });

            return fetched_data;
        });
}

function getExpressionFromAttr(attr) {
    //
    return datatree.acs1115[attr.split('_')[1]].expression;
}

function convertDataToStops(data) {
    //
    const p_stops = {};
    Object.keys(data).forEach(key => {
        p_stops[key.split('US')[1]] = getStopColor(data[key]);
    });
    return p_stops;
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

function getSumlevFromGeography(geography) {
    switch (geography) {
        case 'county':
            return '050';
        case 'state':
            return '040';
        case 'tract':
            return '140';
        case 'bg':
            return '150';
        case 'place':
            return '160';
        default:
            return '000';
    }
}
