function modelDiagnosisVis() {
    let that = this;

    const root = d3.select('#model-diagnosis-vis');

    const WIDTH = 1516;
    const HEIGHT = 788;

    const MARGIN_TOP = 10;
    const MARGIN_BOTTOM = 20;
    const MARGIN_LEFT = CONSTANT.MARGIN_LEFT;
    const MARGIN_RIGHT = CONSTANT.MARGIN_RIGHT;

    const MATRIX_HEIGHT = HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
    const MATRIX_WIDTH = WIDTH - MARGIN_LEFT - MARGIN_RIGHT - 15;

    const CELL_HEIGHT = MATRIX_HEIGHT / 10;
    const CELL_WIDTH = MATRIX_WIDTH / 10;

    const MAX_VAL = 120;

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
                x: MARGIN_LEFT - 100,
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
                    x: MARGIN_LEFT - 20,
                    y: y,
                    'font-size': CONSTANT.FONT_SIZE.default,
                    'fill': '#555',
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle',
                });
        }
    }

    function drawCellArea() {
        for (let digit = 0; digit < 10; digit++) {
            for (let predict = 0; predict < 10; predict++) {
                const x = MARGIN_LEFT + CELL_WIDTH * digit;
                const y = MARGIN_TOP + CELL_HEIGHT * predict;

                root.append('rect')
                    .attrs({
                        x: x - 5,
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
        const model_name = that.model_name;
        const matrix = that.diagnosis_matrix;

        root.selectAll('.matrix').remove();

        // writeModelName(model_name);

        for (let digit = 0; digit < 10; digit++) {
            for (let predict = 0; predict < 10; predict++) {
                let numOfItemAtCell = matrix[digit][predict];
                drawEachCell(digit, predict, numOfItemAtCell);

            }
        }
    }

    function writeModelName() {
        const txt = CONSTANT.MODEL_NAMES_TO_DRWA[that.model_name] + " : " + that.model_name;
        root.append('text')
            .text(txt)
            .attrs({
                x: 20,
                y: 10,
                'font-size': CONSTANT.FONT_SIZE.large,
                'font-weight': 900,
                fill: CONSTANT.COLORS[model_name],
                'text-anchor': 'start',
                'alignment-baseline': 'hanging',
            })
            .classed('matrix', true);
    }

    function drawEachCell(digit, predict, numOfItem) {
        if (numOfItem <= 0) {
            return;
        }
        const MIN_LEN = 5;
        let len = (numOfItem * CELL_HEIGHT) / ( MAX_VAL + MIN_LEN) + MIN_LEN;

        const cell_x = MARGIN_LEFT + (CELL_WIDTH * digit);
        const cell_y = MARGIN_TOP + (CELL_HEIGHT * predict);
        const x = cell_x + ((CELL_HEIGHT - len) / 2) - 5;
        const y = cell_y + (CELL_HEIGHT - len) - 1;

        const dir = "./data/average_image/" + that.model_name + "_results/";
        const filename = digit + "_" + predict + ".png";

        root.append('image')
            .attrs({
                "xlink:href": dir + filename,
                x: x,
                y: y,
                width: len,
                height: len,
            })
            .classed('matrix', true);

        // root.append('rect')
        //     .attrs({
        //         x: x,
        //         y: y,
        //         width: len,
        //         height: len,
        //         fill: CONSTANT.COLORS[model_name]
        //     })
        //     .classed('matrix', true);

        // root.append('text')
        //     .text(numOfItem)
        //     .attrs({
        //         x: cell_x,
        //         y: cell_y + CELL_HEIGHT,
        //         'font-size': font_size,
        //         fill: '#333',
        //         'text-anchor': 'start',
        //         'alignment-baseline': 'ideographic',
        //     })
        //     .classed('matrix', true);


        drawImproveBarChart(digit, predict)

    }

    function drawImproveBarChart(digit, predict) {
        const cell_x = MARGIN_LEFT + (CELL_WIDTH * digit);
        const cell_y = MARGIN_TOP + (CELL_HEIGHT * predict);
        const data = that.improveInfo[digit][predict];

        let i = 0;
        _.forEach(data, (improvement, model_name) => {
            let y = improvement * CELL_HEIGHT / 115;
            root.append('rect')
                .attrs({
                    x: cell_x + CELL_HEIGHT + i * BAR_INTERVAL - 3,
                    y: cell_y + CELL_HEIGHT - y,
                    width: BAR_INTERVAL * 2 / 3,
                    height: y,
                    fill: CONSTANT.COLORS[model_name]
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