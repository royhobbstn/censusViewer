//

export function datasetToYear(dataset) {
    switch (dataset) {
        case 'acs1014':
            return '2014';
        case 'acs1115':
            return '2015';
        case 'acs1216':
            return '2016';
        default:
            return '0000';
    }
}
