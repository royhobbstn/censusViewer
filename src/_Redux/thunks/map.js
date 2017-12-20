/* global fetch*/

import { busyLoadingStyleData, finishedLoadingStyleData } from '../actions/map.js';

import { datatree } from '../../_Config_JSON/datatree.js';
import localforage from "localforage";

console.log(localforage);

localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'CensusWebmap'
});

export function thunkUpdateGeoids(geoids) {
    return (dispatch, getState) => {

        const source_dataset = getState().map.source_dataset;
        const attr = getState().buttonset.selected_attr;
        const attr_short = attr.split('_')[1];

        console.log('thunk');
        console.log(geoids);
        console.log(source_dataset);
        console.log(attr);


        const geoids_to_fetch = [];

        // get an array of all keys in the store
        localforage.keys().then(function(cached_keys) {
            // An array of all the key names.
            console.log(cached_keys);

            // reformat geoid to match localforage version
            const formatted_ids = geoids.map(id => {

                // TODO the hardcoded 05000US

                return `${source_dataset}:${attr_short}:05000US${id}`;
            });

            console.log(formatted_ids);

            // get data from keys you already have, and store it somewhere

            // make list of geoids you dont have

            // send above list to lambda

            // combine cached data with server retrieved data


        }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        });

        // else return only cached data
        if (geoids_to_fetch.length === 0) {
            console.log('nothing to fetch - TODO');
            // return dispatch();
        }


        // TODO
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

                Object.keys(res).forEach(key => {
                    // cache data using localForage; ignore async for setting
                    localforage.setItem(`${source_dataset}:${attr_short}:${key}`, res[key]);
                });

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
