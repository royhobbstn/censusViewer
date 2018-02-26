export function updateStyleData(stops, clusters) {
  return {
    type: 'UPDATE_POLYGON_STYLE',
    stops,
    clusters
  };
}

export function updateMoeData(stops, clusters) {
  return {
    type: 'UPDATE_MOE_DATA',
    stops,
    clusters
  };
}

export function changeMouseover({ mouseover_statistic, mouseover_label, mouseover_moe }) {
  return {
    type: 'UPDATE_MOUSEOVER',
    mouseover_statistic,
    mouseover_label,
    mouseover_moe
  };
}

export function addToInProgressList(arr) {
  return {
    type: 'ADD_TO_IN_PROGRESS',
    arr
  };
}

export function addToMoeInProgressList(arr) {
  return {
    type: 'ADD_TO_MOE_IN_PROGRESS',
    arr
  };
}


export function removeFromInProgressList(arr) {
  return {
    type: 'REMOVE_FROM_IN_PROGRESS',
    arr
  };
}

export function removeFromMoeInProgressList(arr) {
  return {
    type: 'REMOVE_FROM_MOE_IN_PROGRESS',
    arr
  };
}
