export const configuration = {
    datasets: {
        /*acs1014: {
            id: 'acs1014',
            cdn: 'd2y228x0z69ksn.cloudfront.net',
            year: '2014',
            label: 'ACS 2010 - 2014'
        },*/
        acs1115: {
            id: 'acs1115',
            cdn: 'd1r5yvgf798u6b.cloudfront.net',
            year: '2015',
            label: 'ACS 2011 - 2015'
        }/*,
        acs1216: {
            id: 'acs1216',
            cdn: 'd23tgl2ix1iyqu.cloudfront.net',
            year: '2016',
            label: 'ACS 2012 - 2016'
        }*/
    },
    geography: {
    /*
        state: {
            id: 'state',
            sumlev: '040',
            label: 'State'
        },*/
        county: {
            id: 'county',
            sumlev: '050',
            label: 'County'
        },
        /*bg: {
            id: 'bg',
            sumlev: '150',
            label: 'Block Group'
        },*/
        tract: {
            id: 'tract',
            sumlev: '140',
            label: 'Tract'
        }/*,
        place: {
            id: 'place',
            sumlev: '160',
            label: 'Place'
        }*/
    },
    tiles: 's3-us-west-2.amazonaws.com/vtiles-static',
    startup: {
        source_geography: 'county',
        source_dataset: 'acs1115',
        selected_attr: 'mhi',
    }

};
