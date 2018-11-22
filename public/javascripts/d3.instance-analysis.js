function instanceAnalysisVis() {
    let that = this;

    const root = d3.select('#instance-analysis-vis');

    const WIDTH = 374;
    let HEIGHT = 1000;

    const MARGIN_LEFT = 20;

    const VIEW_WIDTH = WIDTH - MARGIN_LEFT;
    const AVG_IMG_LEN = (VIEW_WIDTH - MARGIN_LEFT) * 0.8;

    const MARGIN_TOP = 110 + AVG_IMG_LEN;

    const CELL_HEIGHT = 48;
    const IMG_LEN = 32;
    const CELL_WIDTH = 60;
    const CIRCLE_RADIUS = IMG_LEN * 0.4;

    let imgs_idx = [];

    drawAxis();

    this.drawInstanceList = function (condition) {
        imgs_idx = Processor.getImgsIdx(condition);
        HEIGHT = imgs_idx.length * CELL_HEIGHT + MARGIN_TOP;
        d3.select('#instance-analysis-vis').style('height', HEIGHT);
        drawTitle(condition);
        drawAvgImg(condition.model_name, condition.digit, condition.predict);
        drawDigits(condition.digit, imgs_idx);
    };


    function drawAxis() {
        root.append('text')
            .text("CONDITION")
            .attrs({
                x: MARGIN_LEFT,
                y: 20,
                'font-size': CONSTANT.FONT_SIZE.default,
                'font-weight': 900,
                fill: '#555',
                'text-anchor': 'start',
                'alignment-baseline': 'hanging',
            });

        _.forEach(CONSTANT.MODEL_NAMES, (model_name, j) => {
            root.append('text')
                .text(CONSTANT.MODEL_NAMES_TO_DRWA[model_name])
                .attrs({
                    x: MARGIN_LEFT + CELL_WIDTH + j * CELL_WIDTH + 15,
                    y: MARGIN_TOP - 20,
                    'font-size': CONSTANT.FONT_SIZE.default,
                    fill: '#555',
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle',
                })
        });
    }

    function drawTitle(condition) {
        root.selectAll(".analysis_vis.title").remove();
        const title = CONSTANT.MODEL_NAMES_TO_DRWA[condition.model_name]
            + "  | Digit : " + condition.digit
            + "  | Predict : " + condition.predict;

        root.append('text')
            .text(title)
            .attrs({
                x: MARGIN_LEFT + 10,
                y: 60,
                'font-size': CONSTANT.FONT_SIZE.default,
                'font-weight': 900,
                fill: '#555',
                'text-anchor': 'hanging',
                'alignment-baseline': 'center',
            })
            .classed('analysis_vis', true)
            .classed("title", true);
    }

    function drawAvgImg(model_name, digit, predict) {
        root.selectAll(".analysis_vis.avg_img").remove();

        const dir = "./data/average_image/" + model_name + "_results/";
        const filename = digit + "_" + predict + ".png";

        root.append('image')
            .attrs({
                "xlink:href": dir + filename,
                x: MARGIN_LEFT + (VIEW_WIDTH - AVG_IMG_LEN) / 3,
                y: 70,
                width: AVG_IMG_LEN,
                height: AVG_IMG_LEN,
            })
            .classed('analysis_vis', true)
            .classed('avg_img', true);
    }

    function drawDigits(digit, imgs_idx) {
        root.selectAll(".analysis_vis.digit").remove();

        _.forEach(imgs_idx, (img_idx, i) => {
            const file_dir = "./data/mnist_png_testing/" + digit + "/" + digit + "_" + (img_idx + 1) + ".png";
            root.append('image')
                .attrs({
                    "xlink:href": file_dir,
                    x: MARGIN_LEFT,
                    y: MARGIN_TOP + CELL_HEIGHT * i,
                    width: IMG_LEN,
                    height: IMG_LEN,
                })
                .on('mouseover', function () {
                    console.log(file_dir);
                })
                .classed("analysis_vis", true)
                .classed("digit", true);

            _.forEach(CONSTANT.MODEL_NAMES, (model_name, j) => {
                const cur_m_predict = DATA.MODELS_PREDICTION[model_name][digit * 1000 + img_idx][1];

                if (cur_m_predict === digit) {
                    root.append('circle')
                        .attrs({
                            cx: MARGIN_LEFT + CELL_WIDTH + j * CELL_WIDTH + 15,
                            cy: MARGIN_TOP + CELL_HEIGHT * i + CIRCLE_RADIUS,
                            r: CIRCLE_RADIUS,
                            fill: CONSTANT.COLORS['improve']
                        })
                        .classed("analysis_vis", true)
                        .classed("digit", true);
                    root.append('circle')
                        .attrs({
                            cx: MARGIN_LEFT + CELL_WIDTH + j * CELL_WIDTH + 15,
                            cy: MARGIN_TOP + CELL_HEIGHT * i + CIRCLE_RADIUS,
                            r: CIRCLE_RADIUS * 0.6,
                            fill: '#fff'
                        })
                        .classed("analysis_vis", true)
                        .classed("digit", true);
                } else {
                    root.append('text')
                        .text('X')
                        .attrs({
                            x: MARGIN_LEFT + CELL_WIDTH + j * CELL_WIDTH + 15,
                            y: MARGIN_TOP + CELL_HEIGHT * i + CIRCLE_RADIUS,
                            'font-size': CIRCLE_RADIUS * 2,
                            'font-weight': 900,
                            fill: CONSTANT.COLORS['wrong-both'],
                            'text-anchor': 'middle',
                            'alignment-baseline': 'middle',
                        })
                        .classed('analysis_vis', true)
                        .classed("digit", true);
                }
            })
        });
    }

    return that;
}
