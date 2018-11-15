function modelDiagnosisVis() {
    let that = this;

    const root = d3.select('#model-diagnosis-vis');

    const WIDTH = 1516;
    const HEIGHT = 829;

    const MARGIN_TOP = 75;
    const MARGIN_BOTTOM = 20;
    const MARGIN_LEFT = CONSTANT.MARGIN_LEFT;
    const MARGIN_RIGHT = 15;

    const MATRIX_HEIGHT = HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
    const MATRIX_WIDTH = WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

    const CELL_HEIGHT = MATRIX_HEIGHT / 10;
    const CELL_WIDTH = MATRIX_WIDTH / 10;

    const MAX_VAL = 120;

    const BAR_INTERVAL = (CELL_WIDTH - CELL_HEIGHT) / 4;

    this.improveInfo = {};

    this.updateMatrix = function (model_name) {
        const diagnosis_matrix = Processor.getDiagnosisMatrix(model_name);
        that.improveInfo = Processor.getImporveInfoMatrix(model_name);
        draw(diagnosis_matrix, model_name)
    };

    drawCellArea();

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
                        stroke: '#ccc'
                    })
                    .classed('axis', true);
            }
        }
    }

    function draw(matrix, model_name) {
        root.selectAll('.matrix').remove();

        writeModelName(model_name);

        for (let digit = 0; digit < 10; digit++) {
            for (let predict = 0; predict < 10; predict++) {
                let numOfItemAtCell = matrix[digit][predict];
                drawEachCell(model_name, digit, predict, numOfItemAtCell);

            }
        }
    }

    function writeModelName(model_name) {
        root.append('text')
            .text(model_name)
            .attrs({
                x: 10,
                y: 10,
                'font-size': CONSTANT.FONT_SIZE.large,
                'font-weight': 900,
                fill: CONSTANT.COLORS[model_name],
                'text-anchor': 'start',
                'alignment-baseline': 'hanging',
            })
            .classed('matrix', true);
    }

    function drawEachCell(model_name, digit, predict, numOfItem) {
        if (numOfItem <= 0) {
            return;
        }
        let len = numOfItem * CELL_HEIGHT / MAX_VAL;

        const cell_x = MARGIN_LEFT + (CELL_WIDTH * digit);
        const cell_y = MARGIN_TOP + (CELL_HEIGHT * predict);
        const x = cell_x + ((CELL_HEIGHT - len) / 2) - 5;
        const y = cell_y + (CELL_HEIGHT - len);

        root.append('rect')
            .attrs({
                x: x,
                y: y,
                width: len,
                height: len,
                fill: CONSTANT.COLORS[model_name]
            })
            .classed('matrix', true);

        let font_size = numOfItem;
        font_size = font_size < 56 ? font_size : 46;
        font_size = font_size > 12 ? font_size : 12;

        root.append('text')
            .text(numOfItem)
            .attrs({
                x: cell_x,
                y: cell_y + CELL_HEIGHT,
                'font-size': font_size,
                fill: '#333',
                'text-anchor': 'start',
                'alignment-baseline': 'ideographic',
            })
            .classed('matrix', true);


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
                    x: cell_x + CELL_HEIGHT + i * BAR_INTERVAL,
                    y: cell_y + CELL_HEIGHT - y,
                    width: BAR_INTERVAL * 2 / 3,
                    height: y,
                    fill: CONSTANT.COLORS[model_name]
                })
                .classed('matrix', true);
            i++;
        })
    }

    return that;
}