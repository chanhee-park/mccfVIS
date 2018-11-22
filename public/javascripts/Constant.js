const CONSTANT = new function () {
    this.MARGIN_LEFT = 150;
    this.MARGIN_RIGHT = 30;

    this.FONT_SIZE = {
        'default': 16,
        'large': 28,
    };
    this.MODEL_NAMES = ['knn', 'random_forest', 'softmax_regression', 'neural_network', 'stacked_autoencoder'];

    this.MODEL_NAMES_TO_DRWA = {
        'knn': 'm-0',
        'random_forest': 'm-1',
        'softmax_regression': 'm-2',
        'neural_network': 'm-3',
        'stacked_autoencoder': 'm-4'
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
    }
};
