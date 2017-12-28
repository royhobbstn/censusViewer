export function busyLoadingStyleData() {
    return {
        type: 'BUSY_LOADING_STYLE'
    };
}

export function finishedLoadingStyleData(keys, stops) {
    return {
        type: 'UPDATE_POLYGON_STYLE',
        keys,
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
