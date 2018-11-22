function instanceAnalysisVis() {
    let that = this;

    const root_info_area = d3.select('#instance-analysis-vis');
    const root_scroll_area = d3.select('#instance-analysis-vis__scroll-area');

    const WIDTH = 374;
    const INFO_AREA_HEIGHT = 334;
    let SCROLL_AREA_HEIGHT = 1000;

    const MARGIN_LEFT = 20;

    const VIEW_WIDTH = WIDTH - MARGIN_LEFT;
    const AVG_IMG_LEN = VIEW_WIDTH - 120;

    const MARGIN_TOP = 110 + AVG_IMG_LEN;

    const CELL_SIZE = WIDTH / 6;
    const IMG_LEN = CELL_SIZE;
    const CIRCLE_RADIUS = IMG_LEN * 0.1;

    let imgs_idx = [];

    drawInfo();

    this.drawInstanceList = function (condition) {
        imgs_idx = Processor.getImgsIdx(condition);
        SCROLL_AREA_HEIGHT = imgs_idx.length * CELL_SIZE + 2;
        d3.select('#instance-analysis-vis__scroll-area').style('height', SCROLL_AREA_HEIGHT);
        drawTitle(condition);
        drawAvgImg(condition.model_name, condition.digit, condition.predict);
        drawADigitGrid(imgs_idx.length);
        drawDigits(condition.digit, imgs_idx);
    };


    function drawInfo() {
        root_info_area.append('text')
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
            root_info_area.append('text')
                .text(CONSTANT.MODEL_NAMES_TO_DRWA[model_name])
                .attrs({
                    x: MARGIN_LEFT + CELL_SIZE + j * CELL_SIZE + 15,
                    y: MARGIN_TOP - 20,
                    'font-size': CONSTANT.FONT_SIZE.default,
                    fill: '#555',
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle',
                })
        });
    }

    function drawTitle(condition) {
        root_info_area.selectAll(".analysis_vis.title").remove();
        const title = CONSTANT.MODEL_NAMES_TO_DRWA[condition.model_name]
            + "  | Digit : " + condition.digit
            + "  | Predict : " + condition.predict;

        root_info_area.append('text')
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
        root_info_area.selectAll(".analysis_vis.avg_img").remove();

        const dir = "./data/average_image/" + model_name + "_results/";
        const filename = digit + "_" + predict + ".png";

        root_info_area.append('image')
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

    function drawADigitGrid(num_of_instances) {
        // 세로 줄
        for (let i = 1; i < CONSTANT['MODEL_NAMES'].length + 1; i++) {
            root_scroll_area.append('line')
                .attrs({
                    x1: CELL_SIZE * i,
                    x2: CELL_SIZE * i,
                    y1: 0,
                    y2: SCROLL_AREA_HEIGHT,
                    stroke: CONSTANT.COLORS.grid_stroke,
                    'stroke-width': 2
                })
        }

        // 가로 줄
        for (let i = 0; i <= num_of_instances + 1; i++) {
            root_scroll_area.append('line')
                .attrs({
                    x1: 0,
                    x2: WIDTH,
                    y1: CELL_SIZE * i,
                    y2: CELL_SIZE * i,
                    stroke: CONSTANT.COLORS.grid_stroke

                })
        }
    }

    function drawDigits(digit, imgs_idx) {
        root_scroll_area.selectAll(".analysis_vis.digit").remove();

        _.forEach(imgs_idx, (img_idx, i) => {
            const file_dir = "./data/mnist_png_testing/" + digit + "/" + digit + "_" + (img_idx + 1) + ".png";
            root_scroll_area.append('image')
                .attrs({
                    "xlink:href": file_dir,
                    x: 0,
                    y: CELL_SIZE * i,
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
                const color = cur_m_predict === digit ? CONSTANT.COLORS['improve'] : CONSTANT.COLORS['wrong-both'];

                root_scroll_area.append('circle')
                    .attrs({
                        cx: CELL_SIZE + CELL_SIZE * j + CELL_SIZE / 2,
                        cy: CELL_SIZE * i + CELL_SIZE / 2,
                        r: CIRCLE_RADIUS,
                        fill: color
                    })
                    .classed("analysis_vis", true)
                    .classed("digit", true);
            })
        });
    }

    return that;
}
