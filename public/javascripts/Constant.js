const CONSTANT = new function () {
    const that = this;

    this.MARGIN_LEFT = 340;
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
    // 참고 : Categorical Colors   http://bl.ocks.org/aaizemberg/78bd3dade9593896a59d
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
    };

    // 오색 형광펜
    function color_mode_1() {
        that.COLORS['knn'] = '#b5fd9d';
        that.COLORS['softmax_regression'] = '#9ce6fe';
        that.COLORS['neural_network'] = '#fecb9c';
        that.COLORS['random_forest'] = '#cb9cfc';
        that.COLORS['stacked_autoencoder'] = '#fd9a9b';
    }

    // 수도권 지하철 노선도 1호선 ~ 5호선 (표준)
    // ref. 서울특별시 디자인서울총괄본부. 《지하철정거장 환경디자인 가이드라인》. 서울특별시. 34p쪽
    function color_mode_2() {
        that.COLORS['stacked_autoencoder'] = '#0052a4';
        that.COLORS['neural_network'] = '#009D3E';
        that.COLORS['random_forest'] = '#EF7C1C';
        that.COLORS['softmax_regression'] = '#00A5DE';
        that.COLORS['knn'] = '#996CAC';
    }

    // color_mode_1();
    color_mode_2();
};
