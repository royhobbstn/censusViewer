export const configuration = {
  datasets: {
    acs1014: {
      id: 'acs1014',
      year: '2014',
      label: 'ACS 2010 - 2014'
    },
    acs1115: {
      id: 'acs1115',
      year: '2015',
      label: 'ACS 2011 - 2015'
    },
    acs1216: {
      id: 'acs1216',
      year: '2016',
      label: 'ACS 2012 - 2016'
    }
  },
  geography: {
    state: {
      id: 'state',
      sumlev: '040',
      label: 'State'
    },
    county: {
      id: 'county',
      sumlev: '050',
      label: 'County'
    },
    bg: {
      id: 'bg',
      sumlev: '150',
      label: 'Block Group'
    },
    tract: {
      id: 'tract',
      sumlev: '140',
      label: 'Tract'
    },
    place: {
      id: 'place',
      sumlev: '160',
      label: 'Place'
    }
  },
  tiles: 's3-us-west-2.amazonaws.com/v2-geography-tiles',
  cluster_tiles: 's3-us-west-2.amazonaws.com/v2-cluster-tiles',
  startup: {
    source_geography: 'tract',
    source_dataset: 'acs1216',
    selected_attr: 'mhi',
  }

};
