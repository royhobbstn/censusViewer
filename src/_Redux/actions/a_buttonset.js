//

export function updateDataset(dataset) {
    return {
        type: 'UPDATE_DATASET',
        dataset
    };
}

export function updateGeography(geography) {
    return {
        type: 'UPDATE_GEOGRAPHY',
        geography
    };
}

export function updateTheme(theme) {
    return {
        type: 'UPDATE_THEME',
        theme
    };
}
