export function busyLoadingStyleData() {
    return {
        type: 'BUSY_LOADING_STYLE'
    };
}

export function finishedLoadingStyleData(stops) {
    console.log(stops);
    return {
        type: 'UPDATE_POLYGON_STYLE',
        stops
    };
}

export function changeMouseover({ mouseover_statistic, mouseover_moe, mouseover_label }) {
    return {
        type: 'UPDATE_MOUSEOVER',
        mouseover_statistic,
        mouseover_moe,
        mouseover_label
    };
}
