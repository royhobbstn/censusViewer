/* global fetch */

import { updateStyleData, updateMoeData, changeMouseover, busyData, busyMoe, unbusyData, unbusyMoe } from '../actions/a_map.js';
import LZ from 'lz-string';
import { datatree } from '../../_Config_JSON/datatree.js';
import localforage from "localforage";
import worker_script from './worker';
var myEstWorker = new Worker(worker_script);
var myMoeWorker = new Worker(worker_script);

let layer_add = 0;

// TODO
localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'CensusWebmap'
});

window.key_store = {};

export function thunkChangeMouseover(geoid, name) {
    return (dispatch, getState) => {

        const state = getState();
        const obj = {
            mouseover_statistic: state.map.polygon_stops[geoid],
            mouseover_label: name,
            mouseover_moe: state.map.moe_stops[geoid]
        };

        dispatch(changeMouseover(obj));
    };
}


export function thunkUpdateClusters(pole, current_zoom, current_bounds) {
    return (dispatch, getState) => {

        const trt1 = window.performance.now();

        const state = getState();

        const source_dataset = state.map.source_dataset;
        const sumlev = getSumlevFromGeography(state.map.source_geography);
        const attr = state.map.selected_attr;

        // need to keep track of clusters already retrieved on client and send that information to lambda
        // lambda will figure out clusters to get
        const cluster_done_list = LZ.compressToEncodedURIComponent(JSON.stringify(state.map.cluster_done_list));
        const moe_cluster_done_list = LZ.compressToEncodedURIComponent(JSON.stringify(state.map.moe_cluster_done_list));


        const expression = encodeURIComponent(JSON.stringify(getExpressionFromAttr(source_dataset, attr)));
        const bounds = encodeURIComponent(JSON.stringify(current_bounds));

        // const root = 'http://34.211.152.253:8081/retrieve?';
        const root = 'https://34suzrhb22.execute-api.us-west-2.amazonaws.com/dev/retrieve?';

        const url = `${root}expression=${expression}&dataset=${source_dataset}&sumlev=${sumlev}&pole_lat=${pole.lat}&pole_lng=${pole.lng}&current_zoom=${current_zoom}&current_bounds=${bounds}&cluster_done_list=${cluster_done_list}`;


        if (!myEstWorker.onmessage) {
            myEstWorker.onmessage = (m) => {

                if (!m || !m.data) {
                    dispatch(unbusyData());
                }
                else {

                    const la = window.performance.now();

                    layer_add++;

                    const values = convertDataToStops(m.data.data);
                    console.log('-convertDataToStops:', window.performance.now() - la);

                    const unique_geoids = Object.keys(values);
                    console.log('-unique geoids:', window.performance.now() - la);

                    const stops = unique_geoids.map(key => {
                        return [key, values[key]];
                    });
                    console.log('--stops:', window.performance.now() - la);

                    // to avoid 'must have stops' errors
                    const drawn_stops = (stops.length) ? stops : [
                        ["0", 'blue']
                    ];
                    console.log('-drawn stops:', window.performance.now() - la);

                    const new_layer_name = `tiles-polygons-${layer_add}`;

                    window.map.addLayer({
                        'id': new_layer_name,
                        'type': 'fill',
                        'source': 'tiles',
                        'source-layer': 'main',
                        filter: ['in', 'GEOID', ...unique_geoids],
                        'paint': {
                            'fill-opacity': 0.35,
                            'fill-color': {
                                property: 'GEOID',
                                type: 'categorical',
                                stops: drawn_stops
                            }
                        }
                    }, "admin-2-boundaries-dispute");

                    console.log('-draw new layer:', window.performance.now() - la);

                    dispatch(updateStyleData(m.data.clusters, new_layer_name));
                }
            };
        }


        if (!state.map.busy_data) {
            dispatch(busyData());
            myEstWorker.postMessage({ type: 'fetch', url: url });
        }

        const moe_expression = encodeURIComponent(JSON.stringify(getMoeExpressionFromAttr(source_dataset, attr)));

        const moe_url = `${root}expression=${moe_expression}&dataset=${source_dataset}&sumlev=${sumlev}&pole_lat=${pole.lat}&pole_lng=${pole.lng}&current_zoom=${current_zoom}&current_bounds=${bounds}&cluster_done_list=${moe_cluster_done_list}&moe=true`;



        if (!state.map.busy_moe) {
            dispatch(busyMoe());

            if (!myMoeWorker.onmessage) {
                myMoeWorker.onmessage = (m) => {

                    if (!m || !m.data) {
                        dispatch(unbusyMoe());
                    }
                    else {
                        dispatch(updateMoeData(m.data.data, m.data.clusters));
                    }
                };
            }

            myMoeWorker.postMessage({ type: 'fetch', url: moe_url });

        }

        const uc_delay = window.performance.now() - trt1;
        window.update_clusters += uc_delay;
        console.log('thunkUpdateClusters:', uc_delay);

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




function convertDataToStops(data) {
    //
    const p_stops = {};
    Object.keys(data).forEach(key => {
        p_stops[key] = getStopColor(data[key]);
    });
    return p_stops;
}

function getStopColor(value) {
    //
    if (value === undefined) {
        return "black";
    }

    if (value > 90000) {
        return '#016c59';
    }
    else if (value > 65000) {
        return '#1c9099';
    }
    else if (value > 45000) {
        return '#67a9cf';
    }
    else if (value > 30000) {
        return '#bdc9e1';
    }
    else {
        return '#f6eff7';
    }
}
