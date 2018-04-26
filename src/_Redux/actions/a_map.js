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
