/* global fetch*/

import { busyLoadingStyleData, finishedLoadingStyleData } from '../actions/a_map.js';

import { datatree } from '../../_Config_JSON/datatree.js';
import localforage from "localforage";


localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'CensusWebmap'
});

export function thunkUpdateGeoids(geoids) {
    return (dispatch, getState) => {

        const state = getState();
        const is_busy = state.map.is_busy;

        if (is_busy) {
            console.log('map is busy');
            return;
        }

        const source_dataset = state.map.source_dataset;
        const sumlev = getSumlevFromGeography(state.map.source_geography);
        const attr = state.map.selected_attr;

        const attr_short = attr.split('_')[1];

        // get an array of all keys in the store
        localforage.keys().then(function(cached_keys) {

            // reformat geoid to match localforage version
            const formatted_ids = geoids.map(id => {
                return `${source_dataset}:${attr_short}:${sumlev}00US${id}`;
            });

            // TODO
            // might be quicker to bypass looking through keys
            // instead, just look up a value when local key returns undefined
            const have_info = [];
            const no_info = [];

            formatted_ids.forEach(id => {
                if (cached_keys.includes(id)) {
                    have_info.push(id);
                }
                else {
                    no_info.push(id.split(':')[2].slice(7));
                }
            });

            dispatch(busyLoadingStyleData(true));

            Promise.all([fetchLocalData(have_info), fetchRemoteData(no_info, attr, attr_short, source_dataset)]).then(data => {

                const results = Object.assign({}, data[0], data[1]);
                const all_data = convertDataToStops(results);

                // prevent this dispatch when no new data of value
                dispatch(finishedLoadingStyleData(all_data));


            });

        }).catch(function(err) {
            // This code runs if there were any errors
            console.log('problem reading local storage');
            console.log(err);
        });

    };
}

function fetchLocalData(geoids) {
    //
    const arr = geoids.map(pr => {
        return localforage.getItem(pr);
    });
    return Promise.all(arr).then(arr => {
        const key_with_value = {};
        geoids.forEach((geoid, index) => {
            key_with_value[geoid] = arr[index];
        });
        return key_with_value;
    });
}

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

            Object.keys(res).forEach(key => {
                // cache data using localForage; ignore async for setting
                localforage.setItem(`${source_dataset}:${attr_short}:${key}`, res[key]);
            });

            // create data return object
            const fetched_data = {};
            Object.keys(res).forEach(key => {
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
