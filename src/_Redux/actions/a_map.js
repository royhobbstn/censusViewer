//

export function updateMoeData(clusters) {
  return {
    type: 'UPDATE_MOE_DATA',
    clusters
  };
}

export function updateStyleData(clusters, layer_name) {
  return {
    type: 'UPDATE_POLYGON_STYLE',
    clusters,
    layer_name
  };
}

export function changeMouseoverStatistic(data) {
  return {
    type: 'UPDATE_MOUSEOVER_STATISTIC',
    data
  };
}

export function changeMouseoverLabel(data) {
  return {
    type: 'UPDATE_MOUSEOVER_LABEL',
    data
  };
}

export function changeMouseoverMoe(data) {
  return {
    type: 'UPDATE_MOUSEOVER_MOE',
    data
  };
}

export function busyData() {
  return {
    type: 'BUSY_DATA'
  };
}

export function busyMoe() {
  return {
    type: 'BUSY_MOE'
  };
}

export function unbusyData() {
  return {
    type: 'UNBUSY_DATA'
  };
}

export function unbusyMoe() {
  return {
    type: 'UNBUSY_MOE'
  };
}

export function addToTilesAlreadyRequested(urls) {
  return {
    type: 'ADD_TO_REQUESTED_TILES_LIST',
    urls
  };
}
