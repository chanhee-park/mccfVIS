function modelRankingVis() {

    let that = this;

    const root = d3.select('#model-ranking-vis');

    const WIDTH = 1896;
    const HEIGHT = 243;

    const MARGIN_TOP = 50;
    const RANKING_VIS_HEIGHT = HEIGHT - MARGIN_TOP;
    const CELL_HEIGHT = RANKING_VIS_HEIGHT / (CONSTANT.MODEL_NAMES.length);
    const BAR_HEIGHT = CELL_HEIGHT * 0.5;
    const BAR_MARGIN_TOP = CELL_HEIGHT * 0.2;

    const MARGIN_LEFT = 250;
    const RANKING_VIS_WIDTH = WIDTH - MARGIN_LEFT;
    const CELL_WIDTH = RANKING_VIS_WIDTH / 10;
    const RANKING_CHANGE_LINE_LEN = 30;
    const BAR_WIDTH = CELL_WIDTH - RANKING_CHANGE_LINE_LEN;

    let models_performance = Processor.getPerformances(CONSTANT.MODEL_NAMES);

    this.update = function (data, criteria) {
        models_performance = data;
        const ranking_info = getRankingInfo(criteria);

        // toDo : 트렌지션 적용 시키면 간지쩔탱
        draw(ranking_info);
    };

    const ranking_info = getRankingInfo('true');
    draw(ranking_info);

    function draw(ranking_info) {
        removeAll();

        // 클래스의 이름을 적는다.
        for (let digit = 0; digit < 10; digit++) {
            root.append('text')
                .text('class-' + digit)
                .attrs({
                    x: MARGIN_LEFT + (digit * CELL_WIDTH) + (BAR_WIDTH / 2),
                    y: MARGIN_TOP / 2,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'central',
                    'fill': '#333',
                    'font-size': '16px',
                })
        }

        // 각각의 모델을 순회하며 그린다.
        _.forEach(CONSTANT.MODEL_NAMES, (model_name) => {
            const model_performance = models_performance[model_name];

            // 각각의 클래스를 순회하며 그린다.
            _.forEach(model_performance, (performance_by_class, digit) => {
                digit = parseInt(digit);
                const ranking = ranking_info[digit].indexOf(model_name);

                // 모델 이름을 적는다.
                if (digit === 0) {
                    root.append('text')
                        .text(model_name)
                        .attrs({
                            x: 150,
                            y: MARGIN_TOP + (ranking * CELL_HEIGHT) + (CELL_HEIGHT / 2),
                            'text-anchor': 'end',
                            'alignment-baseline': 'central',
                            'fill': '#333',
                            'font-size': '16px',
                        })
                        .classed('model-name', true)
                        .on("mouseover", function () {
                            d3.selectAll('.cell-background' + '.' + model_name).style("fill", CONSTANT.COLORS[model_name]);
                            d3.selectAll('.ranking-change-line' + '.' + model_name).style("stroke-width", CELL_HEIGHT);
                        })
                        .on("mouseout", function () {
                            d3.selectAll('.cell-background' + '.' + model_name).style("fill", "#fff");
                            d3.selectAll('.ranking-change-line' + '.' + model_name).style("stroke-width", "3px");
                        });

                    // 셀은 흰색 배경을 가진다.
                    root.append('rect')
                        .attrs({
                            x: 0,
                            y: MARGIN_TOP + (ranking * CELL_HEIGHT) - 2,
                            width: MARGIN_LEFT,
                            height: CELL_HEIGHT,
                            fill: '#fff',
                            'z-index': -1
                        })
                        .classed('cell-background', true)
                        .classed(model_name, true);
                }

                // 셀은 흰색 배경을 가진다.
                root.append('rect')
                    .attrs({
                        x: MARGIN_LEFT + (digit * CELL_WIDTH) - 2,
                        y: MARGIN_TOP + (ranking * CELL_HEIGHT) - 2,
                        width: BAR_WIDTH + 10,
                        height: CELL_HEIGHT,
                        fill: '#fff',
                        'z-index': -1
                    })
                    .classed('cell-background', true)
                    .classed(model_name, true);

                // 순위 변경선을 그린다.
                if (digit !== 9) {
                    const next_digit = digit + 1;
                    const next_ranking = ranking_info[next_digit].indexOf(model_name);
                    root.append('line')
                        .attrs({
                            x1: MARGIN_LEFT + (digit * CELL_WIDTH) + BAR_WIDTH - 10,
                            x2: MARGIN_LEFT + (next_digit * CELL_WIDTH) + 10,
                            y1: MARGIN_TOP + (ranking * CELL_HEIGHT) + (BAR_HEIGHT / 2) + BAR_MARGIN_TOP,
                            y2: MARGIN_TOP + (next_ranking * CELL_HEIGHT) + (BAR_HEIGHT / 2) + BAR_MARGIN_TOP,
                            stroke: CONSTANT.COLORS[model_name],
                            'stroke-width': '3px',
                        })
                        .classed('ranking-change-line', true)
                        .classed(model_name, true);
                }

                // 바를 그린다.
                // 스트로크를 배경 사각형으로 표현한다.
                root.append('rect')
                    .attrs({
                        x: MARGIN_LEFT + (digit * CELL_WIDTH) - 2,
                        y: MARGIN_TOP + BAR_MARGIN_TOP + (ranking * CELL_HEIGHT) - 2,
                        width: BAR_WIDTH + 4,
                        height: BAR_HEIGHT + 4,
                        fill: '#777',
                    })
                    .classed('performance-bar-stroke', true);
                // < 맞음, 틀림, 개선, 악화> 등에 맞춰 각각의 비율을 그린다.
                let pre_ratio = 0;
                _.forEach(performance_by_class, (ratio_val, ratio_name) => {
                    root.append('rect')
                        .attrs({
                            x: MARGIN_LEFT + (digit * CELL_WIDTH) + (pre_ratio * BAR_WIDTH),
                            y: MARGIN_TOP + BAR_MARGIN_TOP + (ranking * CELL_HEIGHT),
                            width: ratio_val * BAR_WIDTH,
                            height: BAR_HEIGHT,
                            fill: CONSTANT.COLORS[ratio_name],
                        })
                        .classed('performance-bar', true);
                    pre_ratio += ratio_val;
                });

            })
        });
        root.selectAll('.cell-background').raise();
        root.selectAll('.model-name').raise();
        root.selectAll('.ranking-change-line').raise();
        root.selectAll('.performance-bar-stroke').raise();
        root.selectAll('.performance-bar').raise();
    }

    function removeAll() {
        d3.selectAll('#model-ranking-vis > *').remove();
    }

    /**
     * criteria 를 기준으로한 클래스별 모델 성능 순위를 돌려줍니다.
     * 반환하는 객체의 key 는 클래스, value 는 성능순 모델명 배열입니다.
     * @param criteria
     * @returns {{}}
     */
    function getRankingInfo(criteria) {
        let ranking_info = {};

        for (let digit = 0; digit < 10; digit++) {
            ranking_info[digit] = [];
            let models_score = [];
            _.forEach(CONSTANT.MODEL_NAMES, (model_name) => {
                models_score.push({
                    model_name,
                    score: models_performance[model_name][digit][criteria]
                });
            });

            models_score = _.sortBy(models_score, [function (o) {
                return 1 - o.score;
            }]);

            _.forEach(models_score, (model_score) => {
                ranking_info[digit].push(model_score['model_name']);
            });

        }
        return ranking_info;
    }

    return this;
}

setTimeout(function () {
    Util.MODEL_RANKING_VIS.update(Processor.getPerformances(CONSTANT.MODEL_NAMES), 'true');
}, 5000);