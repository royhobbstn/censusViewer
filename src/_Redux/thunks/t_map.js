/* global fetch TextDecoder*/

import { busyLoadingStyleData, notBusyLoadingStyleData, updateStyleData, changeMouseover, addToInProgressList, removeFromInProgressList } from '../actions/a_map.js';

import { datatree } from '../../_Config_JSON/datatree.mjs';
import localforage from "localforage";


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

        dispatch(busyLoadingStyleData(true));

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

        const file_list = Array.from(new Set(getKeyFromGeoid(no_value)));

        const to_send_file_list = file_list.filter(file => {
            return !in_progress_file_list.includes(file);
        });

        // remove currently in progress file_list values from above
        // dispatch event to lock those file_list values
        dispatch(addToInProgressList(to_send_file_list));

        fetchRemoteData(to_send_file_list, attr, source_dataset)
            .then(res => {
                console.log('complete:', res);
                dispatch(notBusyLoadingStyleData());
                // dispatch event to free up in progress geoids
                dispatch(removeFromInProgressList(to_send_file_list));
            })
            .catch(err => {
                console.error('err:', err);
                dispatch(notBusyLoadingStyleData());
                // dispatch event to free up in progress geoids
                dispatch(removeFromInProgressList(to_send_file_list));
            });



        // call to lambda functions to retrieve data
        function fetchRemoteData(file_list, attr, source_dataset) {

            // short circuit when no geoids to fetch remotely
            if (file_list.length === 0) {
                return Promise.resolve({});
            }


            return fetch('https://kb7eqof39c.execute-api.us-west-2.amazonaws.com/dev/fast-collate', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "file_list": file_list, "expression": getExpressionFromAttr(source_dataset, attr), "moe_expression": getMoeExpressionFromAttr(source_dataset, attr), dataset: source_dataset })
                })
                .then(processChunkedResponse);



            function processChunkedResponse(response) {


                var reader = response.body.getReader();
                var decoder = new TextDecoder();
                let leftover = '';

                return readChunk();

                function readChunk() {
                    return reader.read().then(appendChunks);
                }

                function appendChunks(result) {
                    var chunk = leftover + decoder.decode(result.value || new Uint8Array(), { stream: !result.done });

                    const end_bracket = chunk.lastIndexOf('}');

                    leftover = chunk.slice(end_bracket + 1);
                    chunk = chunk.slice(0, end_bracket + 1);

                    let parsed;
                    if (chunk) {
                        try {
                            parsed = chunk.split("}{");
                            parsed = parsed.join("},{");
                            parsed = JSON.parse("[" + parsed + "]");
                        }
                        catch (e) {
                            console.log(e);
                            console.log(parsed);
                            console.log(end_bracket);
                            console.log(leftover);
                            return;
                        }
                        const res = Object.assign({}, ...parsed);
                        const fetched_data = {};
                        Object.keys(res).forEach(key => {
                            window.key_store[`${source_dataset}:${attr}:${key}`] = res[key];
                            if (!key.includes('_moe')) {
                                fetched_data[`${source_dataset}:${attr}:${key}`] = res[key];
                            }
                        });

                        console.log(fetched_data);

                        // convert the raw numbers to colors for styling
                        const stops = convertDataToStops(fetched_data);

                        // prevent this dispatch when no new data of value
                        dispatch(updateStyleData(stops));
                    }

                    if (result.done) {
                        console.log('returning');
                        leftover = '';
                        return;
                    }
                    else {
                        console.log('recursing');
                        return readChunk();
                    }



                }
            }

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
