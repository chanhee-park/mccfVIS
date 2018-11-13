function modelDiagnosisVis() {
    let that = this;

    const root = d3.select('#model-diagnosis-vis');

    const WIDTH = 1896;
    const HEIGHT = 829;

    const MARGIN_TOP = 10;
    const MARGIN_LEFT = CONSTANT.MARGIN_LEFT;

    const MATRIX_HEIGHT = HEIGHT - MARGIN_TOP;
    const MATRIX_WIDTH = WIDTH - MARGIN_LEFT;

    const CELL_HEIGHT = MATRIX_HEIGHT / 10;
    const CELL_WIDTH = MATRIX_WIDTH / 10;

    this.updateMatrix = function (model_name) {
        const diagnosis_matrix = Processor.getDiagnosisMatrix(model_name);
        drawNumOfItemAtCell(diagnosis_matrix, model_name)
    };

    function drawNumOfItemAtCell(matrix, model_name) {
        root.selectAll('.matrix').remove();

        root.append('text')
            .text(model_name)
            .attrs({
                x: 10,
                y: 20,
                'font-size': 48,
                'font-weight': 900,
                fill: '#333',
                'text-anchor': 'start',
                'alignment-baseline': 'hanging',
            })
            .classed('matrix', true);

        for (let digit = 0; digit < 10; digit++) {
            for (let predict = 0; predict < 10; predict++) {
                let numOfItemAtCell = matrix[digit][predict];

                let font_size = numOfItemAtCell;
                font_size = font_size < 64 ? font_size : 64;
                font_size = font_size > 10 ? font_size : 10;

                const x = MARGIN_LEFT + CELL_WIDTH * digit;
                const y = MARGIN_TOP + CELL_HEIGHT * predict;
                let len = numOfItemAtCell < CELL_HEIGHT ? numOfItemAtCell : CELL_HEIGHT;
                root.append('rect')
                    .attrs({
                        x: x + (CELL_WIDTH / 2) - (len / 2),
                        y: y + (CELL_HEIGHT / 2) - (len / 2),
                        width: len,
                        height: len,
                        fill: CONSTANT.COLORS[model_name]
                    })
                    .classed('matrix', true);

                let text = numOfItemAtCell === 0 ? '' : numOfItemAtCell;
                root.append('text')
                    .text(text)
                    .attrs({
                        x: x + CELL_WIDTH / 2,
                        y: y + CELL_HEIGHT / 2,
                        'font-size': font_size,
                        fill: '#333',
                        'text-anchor': 'middle',
                        'alignment-baseline': 'middle',
                    })
                    .classed('matrix', true);
            }
        }
    }

    return that;
}