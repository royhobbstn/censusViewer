/* global fetch*/

import { busyLoadingStyleData, finishedLoadingStyleData } from '../actions/map.js';

export function thunkButtonsetClick(el, geoids) {
    return (dispatch, getState) => {

        dispatch(busyLoadingStyleData(true));


        fetch('https://kb7eqof39c.execute-api.us-west-2.amazonaws.com/dev/collate-s3-data', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "geoids": geoids, "expression": ["B19013001"] })
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                const data2 = [
                    ['0820000', 'green'],
                    ['0812815', 'pink']
                ];
                const data = convertDataToStops(res)
                console.log(data);
                dispatch(finishedLoadingStyleData(data));
            });


    };
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
