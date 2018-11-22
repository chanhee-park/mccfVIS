const CONSTANT = new function () {
    this.MARGIN_LEFT = 320;
    this.MARGIN_RIGHT = 30;

    this.FONT_SIZE = {
        'default': 16,
        'large': 28,
    };
    this.MODEL_NAMES = ['stacked_autoencoder', 'neural_network', 'random_forest', 'softmax_regression', 'knn'];

    this.MODEL_NAMES_TO_DRWA = {
        'stacked_autoencoder': 'm-0',
        'neural_network': 'm-1',
        'random_forest': 'm-2',
        'softmax_regression': 'm-3',
        'knn': 'm-4',
    };
    // 참고 : https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
    this.COLORS = {
        'true': '#4363d8',
        'false': '#e6194B',
        'improve': '#4363d8',
        'correct-both': '#83a3e8',
        'worsen': '#e6194B',
        'wrong-both': '#ff699b',
        'not-focus': '#777',
        'knn': '#7db',
        'neural_network': '#db7',
        'random_forest': '#cad',
        'softmax_regression': '#9c7',
        'stacked_autoencoder': '#e9a',
        'grid_stroke': '#bbb'
    }
};
