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
  tiles: ['d3q67u30tir1mv.cloudfront.net', 'd1rz82ekhmlc7r.cloudfront.net', 'd31llbwjzirnw2.cloudfront.net'],
  cluster_tiles: ['d2b9kzwya39zmk.cloudfront.net', 'd2pm6efgokwake.cloudfront.net', 'd1lj4b0hcz5kw8.cloudfront.net'],
  startup: {
    source_geography: 'tract',
    source_dataset: 'acs1216',
    selected_attr: 'mhi',
  }

};
