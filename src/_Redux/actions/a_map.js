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
