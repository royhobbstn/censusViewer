export function busyLoadingStyleData() {
    return {
        type: 'BUSY_LOADING_STYLE'
    };
}

export function finishedLoadingStyleData(stops) {
    return {
        type: 'UPDATE_POLYGON_STYLE',
        stops
    };
}
