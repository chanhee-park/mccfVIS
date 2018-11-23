function modelDiagnosisVis() {
    let that = this;

    const root = d3.select('#model-diagnosis-vis');

    const WIDTH = 1516;
    const HEIGHT = 774;

    const MARGIN_TOP = 10;
    const MARGIN_BOTTOM = 20;
    const MARGIN_LEFT = CONSTANT.MARGIN_LEFT;
    const MARGIN_RIGHT = CONSTANT.MARGIN_RIGHT;

    const SUMMATION_CELL_WIDTH = 70;
    const SUMMATION_CELL_START = MARGIN_LEFT - SUMMATION_CELL_WIDTH;

    const MATRIX_HEIGHT = HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
    const MATRIX_WIDTH = WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

    const CELL_WIDTH = MATRIX_WIDTH / 10;
    const CELL_HEIGHT = MATRIX_HEIGHT / 10;

    const MAX_VAL_BAR = 280;
    const MAX_VAL = 103;

    const BAR_INTERVAL = (CELL_WIDTH - CELL_HEIGHT) / 4;

    this.improveInfo = {};
    this.model_name = null;
    this.diagnosis_matrix = null;

    this.updateMatrix = function (model_name) {
        that.model_name = model_name;
        that.improveInfo = Processor.getImporveInfoMatrix(model_name);
        that.diagnosis_matrix = Processor.getDiagnosisMatrix(model_name);
        draw()
    };

    drawAxis();
    drawCellArea();

    function drawAxis() {
        root.append('text')
            .text("PREDICTED CLASS")
            .attrs({
                x: SUMMATION_CELL_START - 100,
                y: HEIGHT / 2,
                'font-size': CONSTANT.FONT_SIZE.default,
                'fill': '#555',
                'text-anchor': 'middle',
                'alignment-baseline': 'ideographic',
                'writing-mode': 'tb',
                'glyph-orientation-vertical': 0,
            });
        for (let predict = 0; predict < 10; predict++) {
            const y = MARGIN_TOP + CELL_HEIGHT * predict + CELL_HEIGHT / 2;
            root.append('text')
                .text(predict)
                .attrs({
                    x: SUMMATION_CELL_START - 20,
                    y: y,
                    'font-size': CONSTANT.FONT_SIZE.default,
                    'fill': '#555',
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle',
                });
        }
    }

    function drawCellArea() {
        for (let predict = 0; predict < 10; predict++) {
            root.append('rect')
                .attrs({
                    x: SUMMATION_CELL_START,
                    y: MARGIN_TOP + (CELL_HEIGHT * predict),
                    width: SUMMATION_CELL_WIDTH,
                    height: CELL_HEIGHT,
                    fill: '#fff',
                    stroke: CONSTANT.COLORS.grid_stroke,
                });
            for (let digit = 0; digit < 10; digit++) {
                const x = MARGIN_LEFT + CELL_WIDTH * digit;
                const y = MARGIN_TOP + CELL_HEIGHT * predict;
                root.append('rect')
                    .attrs({
                        x: x,
                        y: y,
                        width: CELL_WIDTH,
                        height: CELL_HEIGHT,
                        fill: '#fff',
                        stroke: CONSTANT.COLORS.grid_stroke
                    })
                    .classed('axis', true)
                    .on("mousedown", function () {
                        mouseDown(digit, predict);
                    });
            }
        }
    }

    function draw() {
        root.selectAll('.matrix').remove();
        drawPredictSummationCells();
        drawDigitPredictCells();
    }

    function drawPredictSummationCells() {
        const matrix = that.diagnosis_matrix;

        for (let predict = 0; predict < 10; predict++) {
            let err_sum = 0;
            let improve_sum = {};

            for (let digit = 0; digit < 10; digit++) {
                err_sum += matrix[digit][predict];
                const improveInfos = that.improveInfo[digit][predict];

                _.forEach(improveInfos, (val, key) => {
                    if (improve_sum.hasOwnProperty(key)) {
                        improve_sum[key] += val;
                    } else {
                        improve_sum[key] = val;
                    }
                })
            }
            drawEachSummationCell(predict, err_sum, improve_sum);
        }
    }

    function drawEachSummationCell(predict, num_of_err, improve_info) {
        let i = 0;
        let err_y = num_of_err * CELL_HEIGHT / MAX_VAL_BAR;
        root.append('line')
            .attrs({
                x1: SUMMATION_CELL_START,
                x2: SUMMATION_CELL_START + SUMMATION_CELL_WIDTH,
                y1: MARGIN_TOP + (CELL_HEIGHT * predict) + CELL_HEIGHT - err_y,
                y2: MARGIN_TOP + (CELL_HEIGHT * predict) + CELL_HEIGHT - err_y,
                stroke: '#333',
                'stroke-width': 3
            })
            .classed('matrix', true);

        _.forEach(improve_info, (improvement, model_name) => {
            let y = improvement * CELL_HEIGHT / MAX_VAL_BAR;
            root.append('rect')
                .attrs({
                    x: SUMMATION_CELL_START + i * BAR_INTERVAL + 17,
                    y: MARGIN_TOP + (CELL_HEIGHT * predict) + CELL_HEIGHT - y,
                    width: BAR_INTERVAL * 4 / 5,
                    height: y,
                    fill: CONSTANT.COLORS[model_name]
                })
                .classed('matrix', true);
            i++;
        })
    }

    function drawDigitPredictCells() {
        const matrix = that.diagnosis_matrix;
        for (let digit = 0; digit < 10; digit++) {
            for (let predict = 0; predict < 10; predict++) {
                let numOfItemAtCell = matrix[digit][predict];
                drawEachCell(digit, predict, numOfItemAtCell);
            }
        }
    }

    function drawEachCell(digit, predict, numOfItem) {
        if (numOfItem <= 0) {
            return;
        }
        const MIN_LEN = 5;
        let len = (numOfItem * CELL_HEIGHT) / ( MAX_VAL + MIN_LEN) + MIN_LEN;

        const cell_x = MARGIN_LEFT + (digit * CELL_WIDTH);
        const cell_y = MARGIN_TOP + (CELL_HEIGHT * predict);
        const x = cell_x + ((CELL_HEIGHT - len) / 2);
        const y = cell_y + (CELL_HEIGHT - len) - 1;

        const dir = "./data/average_image/" + that.model_name + "_results/";
        const filename = digit + "_" + predict + ".png";
        root.append('image')
            .attrs({
                "xlink:href": dir + filename,
                x: x,
                // y: y - (CELL_HEIGHT - len) / 2,
                y: y,
                width: len,
                height: len,
            })
            .classed('matrix', true);

        drawImproveBarChart(digit, predict, numOfItem)
    }

    function drawImproveBarChart(digit, predict, num_of_err) {
        const cell_x = MARGIN_LEFT + (CELL_WIDTH * digit);
        const cell_y = MARGIN_TOP + (CELL_HEIGHT * predict);
        const data = that.improveInfo[digit][predict];

        let err_y = num_of_err * CELL_HEIGHT / MAX_VAL_BAR;
        // root.append('line')
        //     .attrs({
        //         x1: cell_x,
        //         x2: cell_x + CELL_WIDTH,
        //         y1: MARGIN_TOP + (CELL_HEIGHT * predict) + CELL_HEIGHT - err_y,
        //         y2: MARGIN_TOP + (CELL_HEIGHT * predict) + CELL_HEIGHT - err_y,
        //         stroke: '#333',
        //         'stroke-width': 1,
        //     })
        //     .classed('matrix', true);

        let i = 0;
        _.forEach(data, (improvement, model_name) => {
            let y = improvement * CELL_HEIGHT / MAX_VAL_BAR;
            root.append('rect')
                .attrs({
                    x: cell_x + CELL_HEIGHT + i * BAR_INTERVAL - 3,
                    y: cell_y + CELL_HEIGHT - y,
                    width: BAR_INTERVAL * 4 / 5,
                    height: y,
                    fill: CONSTANT.COLORS[model_name],
                })
                .classed('matrix', true);
            i++;
        })
    }

    function mouseDown(digit, predict) {
        if (digit === predict) {
            return;
        }
        if (that.model_name === null) {
            return;
        }

        const model_name = that.model_name;
        const condition = { model_name, digit, predict };
        Components.INSTANCE_ANALYSIS_VIS.drawInstanceList(condition)
    }

    return that;
}