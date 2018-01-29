export function updateStyleData(stops) {
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

export function addToInProgressList(arr) {
    return {
        type: 'ADD_TO_IN_PROGRESS',
        arr
    };
}

export function removeFromInProgressList(arr) {
    return {
        type: 'REMOVE_FROM_IN_PROGRESS',
        arr
    };
}
