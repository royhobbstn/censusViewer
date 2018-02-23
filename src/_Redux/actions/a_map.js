export function updateStyleData(stops, clusters) {
  return {
    type: 'UPDATE_POLYGON_STYLE',
    stops,
    clusters
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

export function clustersNowDone(arr) {
  return {
    type: 'ADD_TO_CLUSTERS_DONE',
    arr
  };
}
