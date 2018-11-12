const CONSTANT = new function () {
    this.MODEL_NAMES = ['knn', 'neural_network', 'random_forest', 'softmax_regression', 'stacked_autoencoder'];

    // 참고 : https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
    this.COLORS = {
        'true': '#4363d8',
        'false': '#e6194B',
        'improve': '#4363d8',
        'correct-both': '#83a3e8',
        'worsen': '#e6194B',
        'false-both': '#ff699b',
        'knn': '#469990',
        'neural_network': '#e6beff',
        'random_forest': '#9A6324',
        'softmax_regression': '#f58231',
        'stacked_autoencoder': '#fabebe',
    }
};
