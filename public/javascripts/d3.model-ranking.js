function modelRankingVis() {
    let that = this;

    const root = d3.select('#model-ranking-vis');

    const WIDTH = 1516;
    const HEIGHT = 300;

    const MARGIN_TOP = 70;
    const RANKING_VIS_HEIGHT = HEIGHT - MARGIN_TOP;
    const CELL_HEIGHT = RANKING_VIS_HEIGHT / (CONSTANT.MODEL_NAMES.length);
    const BAR_HEIGHT = CELL_HEIGHT * 0.5;
    const BAR_MARGIN_TOP = CELL_HEIGHT * 0.2;

    const MARGIN_LEFT = CONSTANT.MARGIN_LEFT;
    const MARGIN_RIGHT = CONSTANT.MARGIN_RIGHT;
    const RANKING_VIS_WIDTH = WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
    const CELL_WIDTH = RANKING_VIS_WIDTH / 10;
    const RANKING_CHANGE_LINE_LEN = 40;
    const BAR_WIDTH = CELL_WIDTH - RANKING_CHANGE_LINE_LEN;

    const TEXT_X_END = CONSTANT.MARGIN_LEFT - 220;
    const SPARK_LINE_INTERVAL = 13;
    const SPARK_LINE_MARGIN = 20;

    let models_performance = Processor.getPerformances(CONSTANT.MODEL_NAMES);

    let selected_model = null;

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
        root.append('text')
            .text("ACTUAL CLASS")
            .attrs({
                x: WIDTH / 2,
                y: 15,
                'font-size': CONSTANT.FONT_SIZE.default,
                'fill': '#555',
                'text-anchor': 'middle',
                'alignment-baseline': 'hanging',
            });
        for (let digit = 0; digit < 10; digit++) {
            const x = MARGIN_LEFT + CELL_WIDTH * digit + BAR_WIDTH / 2;
            root.append('text')
                .text(digit)
                .attrs({
                    x: x,
                    y: 45,
                    'font-size': CONSTANT.FONT_SIZE.default,
                    'fill': '#555',
                    'text-anchor': 'middle',
                    'alignment-baseline': 'hanging',
                });
        }

        // 각각의 모델을 순회하며 그린다.
        _.forEach(CONSTANT.MODEL_NAMES, (model_name, i) => {
            const model_performance = models_performance[model_name];
            const ranking_line = [];

            // 모델 이름을 적는다.
            let spark_y_base = MARGIN_TOP + ((i + 1) * CELL_HEIGHT);
            root.append('text')
                .text(CONSTANT.MODEL_NAMES_TO_DRWA[model_name])
                .attrs({
                    x: TEXT_X_END - SPARK_LINE_MARGIN,
                    y: MARGIN_TOP + (i * CELL_HEIGHT) + (CELL_HEIGHT / 2),
                    'text-anchor': 'start',
                    'alignment-baseline': 'middle',
                    'fill': '#333',
                    'font-size': CONSTANT.FONT_SIZE.default,
                })
                .classed('model-name', true)
                .on("mouseover", function () {
                    mouseOn(model_name);
                })
                .on("mouseout", function () {
                    mouseOut(model_name);
                })
                .on("mousedown", function () {
                    mouseDown(model_name);
                });
            // 셀은 흰색 배경을 가진다.
            root.append('rect')
                .attrs({
                    x: 0,
                    y: MARGIN_TOP + (i * CELL_HEIGHT) - 2 + CELL_HEIGHT * 0.1,
                    width: MARGIN_LEFT - 30,
                    height: CELL_HEIGHT * 0.8,
                    fill: '#fff',
                })
                .classed('cell-background', true)
                .classed('name-cell-background', true)
                .classed(model_name, true)
                .on("mouseover", function () {
                    mouseOn(model_name);
                })
                .on("mouseout", function () {
                    mouseOut(model_name);
                })
                .on("mousedown", function () {
                    mouseDown(model_name);
                });
            ranking_line.push({
                x: MARGIN_LEFT - 40,
                y: MARGIN_TOP + (i * CELL_HEIGHT) + (BAR_HEIGHT / 2) + BAR_MARGIN_TOP
            });
            ranking_line.push({
                x: MARGIN_LEFT - 30,
                y: MARGIN_TOP + (i * CELL_HEIGHT) + (BAR_HEIGHT / 2) + BAR_MARGIN_TOP
            });
            ranking_line.push({
                x: MARGIN_LEFT,
                y: MARGIN_TOP + (ranking_info[0].indexOf(model_name) * CELL_HEIGHT) + (BAR_HEIGHT / 2) + BAR_MARGIN_TOP
            });
            ranking_line.push({
                x: MARGIN_LEFT + 10,
                y: MARGIN_TOP + (ranking_info[0].indexOf(model_name) * CELL_HEIGHT) + (BAR_HEIGHT / 2) + BAR_MARGIN_TOP
            });

            // 각각의 클래스를 순회하며 그린다.
            const spark_line_y = [];
            _.forEach(model_performance, (performance_by_class, digit) => {
                digit = parseInt(digit);
                const ranking = ranking_info[digit].indexOf(model_name);
                spark_line_y.push(performance_by_class['true']);

                // 셀은 흰색 배경을 가진다.
                root.append('rect')
                    .attrs({
                        x: MARGIN_LEFT + (digit * CELL_WIDTH) - 2,
                        y: MARGIN_TOP + (ranking * CELL_HEIGHT) - 2,
                        width: BAR_WIDTH + 10,
                        height: CELL_HEIGHT,
                        fill: '#fff',
                    })
                    .classed('cell-background', true)
                    .classed(model_name, true)
                    .on("mouseover", function () {
                        mouseOn(model_name);
                    })
                    .on("mouseout", function () {
                        mouseOut(model_name);
                    })
                    .on("mousedown", function () {
                        mouseDown(model_name);
                    });

                // 순위 변경선을 그린다.
                const next_digit = digit + 1;
                const next_ranking = digit !== 9 ? ranking_info[next_digit].indexOf(model_name) : ranking;

                ranking_line.push({
                    x: MARGIN_LEFT + (digit * CELL_WIDTH) + BAR_WIDTH,
                    y: MARGIN_TOP + (ranking * CELL_HEIGHT) + (BAR_HEIGHT / 2) + BAR_MARGIN_TOP
                });
                if (digit !== 9) {
                    ranking_line.push({
                        x: MARGIN_LEFT + (next_digit * CELL_WIDTH),
                        y: MARGIN_TOP + (next_ranking * CELL_HEIGHT) + (BAR_HEIGHT / 2) + BAR_MARGIN_TOP
                    });
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
                    .classed('performance-bar-stroke', true)
                    .on("mouseover", function () {
                        mouseOn(model_name);
                    })
                    .on("mouseout", function () {
                        mouseOut(model_name);
                    })
                    .on("mousedown", function () {
                        mouseDown(model_name);
                    });

                // < 맞음, 틀림, 개선, 악화> 등에 맞춰 각각의 비율을 그린다.
                let pre_ratio = 0;

                _.forEach(performance_by_class, (ratio_val, ratio_name) => {
                    if (pre_ratio >= 0.999) {
                        ratio_val = 0;
                    }
                    root.append('rect')
                        .attrs({
                            x: MARGIN_LEFT + (digit * CELL_WIDTH) + (pre_ratio * BAR_WIDTH),
                            y: MARGIN_TOP + BAR_MARGIN_TOP + (ranking * CELL_HEIGHT),
                            width: ratio_val * BAR_WIDTH,
                            height: BAR_HEIGHT,
                            fill: CONSTANT.COLORS[ratio_name],
                        })
                        .classed('performance-bar', true)
                        .on("mouseover", function () {
                            mouseOn(model_name);
                        })
                        .on("mouseout", function () {
                            mouseOut(model_name);
                        })
                        .on("mousedown", function () {
                            mouseDown(model_name);
                        });
                    pre_ratio += ratio_val;
                });

            });
            drawRankingPath(ranking_line, model_name);
            drawSparkLine(spark_line_y, spark_y_base, model_name);
            drawAvgPerformance(spark_line_y, spark_y_base, model_name);
        });

        SortSvgObjs();
    }


    function drawRankingPath(lineData, model_name) {
        // This is the accessor function
        let lineBasis = d3.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
            .curve(d3.curveLinear); // linear
        root.append('path')
            .attr("d", lineBasis(lineData))
            .attrs({
                fill: 'none',
                stroke: CONSTANT.COLORS[model_name],
                'stroke-width': 3,
            })
            .classed('ranking-change-line', true)
            .classed('selected', false)
            .classed(model_name, true)
            .on("mouseover", function () {
                mouseOn(model_name);
            })
            .on("mouseout", function () {
                mouseOut(model_name);
            })
            .on("mousedown", function () {
                mouseDown(model_name);
            });
    }

    function drawSparkLine(y_values, y_base, model_name) {
        let lineData = [];
        _.forEach(y_values, (y, digit) => {
            lineData.push({
                x: digit * SPARK_LINE_INTERVAL + TEXT_X_END + SPARK_LINE_MARGIN,
                y: y_base - (2 * y * BAR_HEIGHT) + BAR_HEIGHT - 8
            });
        });

        // This is the accessor function
        let lineBasis = d3.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
            .curve(d3.curveLinear); // curveBasis

        // The line SVG Path we draw
        root.append("path")
            .attr("d", lineBasis(lineData))
            .attrs({
                fill: 'none',
                stroke: CONSTANT.COLORS[model_name],
                'stroke-width': 2,
            })
            .classed('spark-line', true)
            .classed(model_name, true)
            .on("mouseover", function () {
                mouseOn(model_name);
            })
            .on("mouseout", function () {
                mouseOut(model_name);
            })
            .on("mousedown", function () {
                mouseDown(model_name);
            });
    }

    function drawAvgPerformance(performances_by_class, y_base, model_name) {
        const avgPerformance = Processor.getAvgFromJson(performances_by_class);
        const percentage = Math.round(100 * avgPerformance);
        const cx = TEXT_X_END + SPARK_LINE_MARGIN * 2 + SPARK_LINE_INTERVAL * 10;
        const cy = y_base - BAR_HEIGHT;
        const r = BAR_HEIGHT * 0.6;

        root.append('circle')
            .attrs({
                cx: cx,
                cy: cy,
                r: r,
                fill: '#fff',
                stroke: CONSTANT.COLORS[model_name],
                'stroke-width': '2px'
            })
            .classed("avg-performance", true)
            .classed(model_name, true);

        root.append('text')
            .text(percentage)
            .attrs({
                x: cx,
                y: cy,
                'text-anchor': 'middle',
                'alignment-baseline': 'middle',
            })
            .classed("avg-performance", true)
            .classed(model_name, true);
    }

    function removeAll() {
        d3.selectAll('#model-ranking-vis > *').remove();
    }

    function SortSvgObjs() {
        root.selectAll('.cell-background').raise();
        root.selectAll('.model-name').raise();
        root.selectAll('.ranking-change-line').raise();
        root.selectAll('.performance-bar-stroke').raise();
        root.selectAll('.performance-bar').raise();
        root.selectAll('.spark-line').raise();
        root.selectAll('.avg-performance').raise();
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

    function mouseOn(hover_model_name) {
        highlightModel(hover_model_name);
    }

    function mouseOut(de_hover_model_name) {
        deHighlightModel(de_hover_model_name);
        highlightModel(selected_model);
    }


    function mouseDown(model_name) {
        selected_model = model_name;
        highlightModel(selected_model);

        const prediction_changes = Processor.getPredictionChangeInfo(model_name);
        Components.MODEL_RANKING_VIS.update(prediction_changes, 'true');
        Components.MODEL_DIAGNOSIS_VIS.updateMatrix(model_name);
    }

    function highlightModel(model_name) {
        const color = CONSTANT.COLORS[model_name];
        root.selectAll('.name-cell-background' + '.' + model_name).style("fill", color);
        root.selectAll('.ranking-change-line' + '.' + model_name).style("stroke-width", CELL_HEIGHT * 0.8);
        root.selectAll('.spark-line' + '.' + model_name).style("stroke", "#000");
        root.selectAll('circle.avg-performance' + '.' + model_name).style('stroke', '#000');
        root.selectAll('circle.avg-performance' + '.' + model_name).style('fill', color);
    }

    function deHighlightModel(model_name) {
        const color = CONSTANT.COLORS[model_name];

        root.selectAll('.name-cell-background' + '.' + model_name).style("fill", "#fff");
        root.selectAll('.ranking-change-line' + '.' + model_name).style("stroke-width", "3px");
        root.selectAll('.spark-line' + '.' + model_name).style("stroke", color);
        root.selectAll('circle.avg-performance' + '.' + model_name).style('stroke', color);
        root.selectAll('circle.avg-performance' + '.' + model_name).style('fill', '#fff');
    }

    return that;
}

// setTimeout(function () {
//     Components.MODEL_RANKING_VIS.update(Processor.getPerformances(CONSTANT.MODEL_NAMES), 'true');
// }, 3000);