/* global fetch TextDecoder*/

import { updateStyleData, changeMouseover, addToInProgressList, removeFromInProgressList } from '../actions/a_map.js';

import { datatree } from '../../_Config_JSON/datatree.mjs';
import localforage from "localforage";
// import workerize from 'workerize';

// const worker = workerize(`
//                 export function num() {
//                     return 5;
//                 };
// 				export function get(url) {
// 					return fetch(location.origin+'/'+url).then(asJson);
// 				}
// 				function asJson(res) {
// 					return res.json();
// 				}
// 			`, { type: 'module' });

// worker.num().then(pkg => {
//     console.log('Got package name: ', pkg);
// });

localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'CensusWebmap'
});

window.key_store = {};

export function thunkChangeMouseover(geoid, name) {
    return (dispatch, getState) => {
        // acs1115:mhi:05000US08005:63265
        // acs1115:mhi:05000US08005_moe:942

        const state = getState();
        const source_dataset = state.map.source_dataset;
        const sumlev = getSumlevFromGeography(state.map.source_geography);
        const attr = state.map.selected_attr;

        const formatted_geoid = `${source_dataset}:${attr}:${sumlev}00US${geoid}`;

        const obj = {
            mouseover_statistic: window.key_store[formatted_geoid],
            mouseover_label: name,
            mouseover_moe: window.key_store[formatted_geoid + '_moe']
        };

        dispatch(changeMouseover(obj));

    };
}


export function thunkUpdateGeoids(geoids) {
    return (dispatch, getState) => {

        const state = getState();

        const source_dataset = state.map.source_dataset;
        const sumlev = getSumlevFromGeography(state.map.source_geography);
        const attr = state.map.selected_attr;
        const in_progress_file_list = state.map.file_list;

        // convert geoids queried from the screen to a unique key that can be stored in memory
        const formatted_ids = geoids.map(id => {
            return `${source_dataset}:${attr}:${sumlev}00US${id}`;
        });

        // get the value of that unique key (pulling from memory)
        const value_store = formatted_ids.map(pr => {
            return window.key_store[pr];
        });

        const no_value = [];

        // for each geoid, if it doesn't have a value, it will need to be looked up via ajax
        // so put it into an array of geoids to find later
        formatted_ids.forEach((geoid, index) => {
            if (value_store[index] === undefined) {
                no_value.push(geoid.split(':')[2].slice(7));
            }
        });

        // get list of files to send requests to
        const file_list = Array.from(new Set(getKeyFromGeoid(no_value)));

        // don't send if already in progress
        const to_send_file_list = file_list.filter(file => {
            return !in_progress_file_list.includes(file);
        });

        dispatch(addToInProgressList(to_send_file_list));

        // split total amongst 5 requests
        const quantile = to_send_file_list.length / 5;

        const quantile_array = [0, quantile, quantile * 2, quantile * 3, quantile * 4];

        quantile_array.forEach(num => {
            fetchLimitScope(to_send_file_list.slice(num, num + quantile), attr, source_dataset);
        });


        function fetchLimitScope(sliced_list, attr, source_dataset) {
            fetchRemoteData(sliced_list, attr, source_dataset)
                .then(res => {
                    console.log('complete:', res);
                    // dispatch event to free up in progress geoids
                    dispatch(removeFromInProgressList(sliced_list));
                })
                .catch(err => {
                    console.error('err:', err);
                    // dispatch event to free up in progress geoids
                    dispatch(removeFromInProgressList(sliced_list));
                });
        }



        // call to lambda functions to retrieve data
        function fetchRemoteData(file_list, attr, source_dataset) {

            // short circuit when no geoids to fetch remotely
            if (file_list.length === 0) {
                return Promise.resolve({});
            }

            console.log('about to fetch');

            const files = ''; // encodeURIComponent(JSON.stringify(file_list)); // TODO
            const expression = ''; // encodeURIComponent(JSON.stringify(getExpressionFromAttr(source_dataset, attr)));
            const moe_expression = ''; // encodeURIComponent(JSON.stringify(getMoeExpressionFromAttr(source_dataset, attr)));

            const url = `https://kb7eqof39c.execute-api.us-west-2.amazonaws.com/dev/collate?file_list=${files}&expression=${expression}&moe_expression=${moe_expression}&dataset=${source_dataset}`;

            return fetch(url)
                .then(res => res.json)
                .then(fetched_data => {
                    console.log(fetched_data);

                    Object.keys(fetched_data).forEach(key => {
                        window.key_store[`${source_dataset}:${attr}:${key}`] = fetched_data[key];
                        if (!key.includes('_moe')) {
                            fetched_data[`${source_dataset}:${attr}:${key}`] = fetched_data[key];
                        }
                    });

                    console.log(fetched_data);

                    // convert the raw numbers to colors for styling
                    const stops = convertDataToStops(fetched_data);

                    // prevent this dispatch when no new data of value
                    dispatch(updateStyleData(stops));

                });


        }

    };



}



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

function getMoeExpressionFromAttr(dataset, attr) {
    // TODO this needs to be validated

    const numerator_raw = datatree[dataset][attr].numerator;
    const denominator_raw = datatree[dataset][attr].denominator;

    // escape hatch.  todo, re-examine moe calculation
    if (numerator_raw.length === 1 && denominator_raw.length === 0) {
        return [numerator_raw[0] + '_moe'];
    }

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

    const numerator_moe = ["sqrt", "("];
    numerator_raw.forEach((item, index) => {
        numerator_moe.push("(");
        numerator_moe.push(item + '_moe');
        numerator_moe.push("^");
        numerator_moe.push("2");
        numerator_moe.push(")");
        if (index !== numerator_raw.length - 1) { numerator_moe.push("+"); }
    });
    numerator_moe.push(")");

    const denominator_moe = ["sqrt", "("];
    denominator_raw.forEach((item, index) => {
        denominator_moe.push("(");
        denominator_moe.push(item + '_moe');
        denominator_moe.push("^");
        denominator_moe.push("2");
        denominator_moe.push(")");
        if (index !== denominator_raw.length - 1) { denominator_moe.push("+"); }
    });
    if (!denominator_raw.length) {
        denominator_moe.push("1");
    }
    denominator_moe.push(")");

    console.log(["(", "sqrt", "(", "(", "(", ...numerator_moe, ")", "^", "2", ")", "-", "(", "(", "(", "(", ...numerator, ")", "/", "(", ...denominator, ")", ")", "^", "2", ")", "*", "(", "(", ...denominator_moe, ")", "^", "2", ")", ")", ")", ")", "/", "(", ...denominator, ")"]);

    return ["(", "sqrt", "(", "(", "(", ...numerator_moe, ")", "^", "2", ")", "-", "(", "(", "(", "(", ...numerator, ")", "/", "(", ...denominator, ")", ")", "^", "2", ")", "*", "(", "(", ...denominator_moe, ")", "^", "2", ")", ")", ")", ")", "/", "(", ...denominator, ")"];
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

function getKeyFromGeoid(geoids) {
    return geoids.map(d => {
        // state = 2 characters (state[2])
        // county = 5 characters (state[2]|county[3])
        // place - 7 characters (state[2]|place[5])
        // tract = 11 characters (state[2]|county[3]|tract[6])
        // bg = 12 characters (state[2]|county[3]|tract[6]|bg[1])

        // return proper s3 file
        const len = d.length;
        const state = d.slice(0, 2);
        const statecounty = d.slice(0, 5);

        switch (len) {
            case 2:
                return `/040/${state}`;
            case 5:
                return `/050/${state}`;
            case 7:
                return `/160/${state}`;
            case 11:
                return `/140/${statecounty}`;
            case 12:
                return `/150/${statecounty}`;
            default:
                console.error(`unexpected geoid: ${d}`);
                return '';
        }

    });
}
