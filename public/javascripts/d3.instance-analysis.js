function instanceAnalysisVis() {
    let that = this;

    const root_info_area = d3.select('#instance-analysis-vis');
    const root_scroll_area = d3.select('#instance-analysis-vis__scroll-area');

    const WIDTH = 374;
    const INFO_AREA_HEIGHT = 800;
    let SCROLL_AREA_HEIGHT = 300;

    const MARGIN_LEFT = 20;

    const VIEW_WIDTH = WIDTH - MARGIN_LEFT;
    const AVG_IMG_LEN = VIEW_WIDTH - 110;

    const MARGIN_TOP = 110 + AVG_IMG_LEN;

    const NUM_OF_CELLS_IN_ROW = 7;
    const CELL_SIZE = WIDTH / NUM_OF_CELLS_IN_ROW;
    const IMG_LEN = CELL_SIZE;


    const CASE_SET_BAR_HEIGHT_AREA = 29;
    const CASE_SET_BAR_HEIGHT_FILL = CASE_SET_BAR_HEIGHT_AREA * 0.6;
    const CONDITIONED_MODEL_RADIUS = CASE_SET_BAR_HEIGHT_FILL * 0.5;
    const MAX_SET_BAR_VALUE = 100;
    const MAX_SET_BAR_WIDTH = 180;

    const SET_NAME_AREA = 30;

    let imgs_idx = [];

    drawInfo();
    drawSetGrid();

    this.drawInstanceList = function (condition) {
        imgs_idx = Processor.getImgsIdx(condition);
        SCROLL_AREA_HEIGHT = Math.ceil(imgs_idx.length / 8) * CELL_SIZE + 2;
        d3.select('#instance-analysis-vis__scroll-area').style('height', SCROLL_AREA_HEIGHT);
        drawTitle(condition);

        drawAvgImg(condition.model_name, condition.digit, condition.predict);
        drawCasesSet(condition);

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
    }

    function drawSetGrid() {
        _.forEach(CONSTANT.MODEL_NAMES, (model_name, j) => {
            let x = MARGIN_LEFT + j * SET_NAME_AREA + 10;
            let y = MARGIN_TOP - 20;
            root_info_area.append('text')
                .text(CONSTANT.MODEL_NAMES_TO_DRWA[model_name])
                .attrs({
                    transform: 'translate(' + x + ',' + y + ') rotate(45) ',
                    'font-size': CONSTANT.FONT_SIZE.default,
                    fill: '#555',
                    'text-anchor': 'middle',
                    'alignment-baseline': 'ideographic',
                })
                .classed('grid');

            root_info_area.append('line')
                .attrs({
                    x1: 0,
                    x2: WIDTH,
                    y1: y + 15,
                    y2: y + 15,
                    stroke: '#ccc',
                })
        });
    }

    function drawCasesSet(condition) {
        root_info_area.selectAll(".analysis_vis.improve-case-bar-chart").remove();

        let case_set = Processor.getCaseSet(condition);

        _.forEach(case_set, (e, yi) => {
            const model_ids = e.models;
            const number_of_items = e.number_of_items;

            const cy = MARGIN_TOP + yi * CASE_SET_BAR_HEIGHT_AREA + CONDITIONED_MODEL_RADIUS;
            // model circle line
            root_info_area.append('line')
                .attrs({
                    x1: MARGIN_LEFT + CONDITIONED_MODEL_RADIUS + 10,
                    x2: MARGIN_LEFT + 4 * SET_NAME_AREA + CONDITIONED_MODEL_RADIUS + 10,
                    y1: cy,
                    y2: cy,
                    stroke: '#555',
                })
                .classed('analysis_vis', true)
                .classed('improve-case-bar-chart', true);

            // draw set circle
            for (let i = 0; i < 5; i++) {
                const model_name = CONSTANT.MODEL_NAMES[i];
                const model_color = CONSTANT.COLORS[model_name];

                const r = model_ids.indexOf(i) >= 0 ? CONDITIONED_MODEL_RADIUS : 3;
                const c = model_ids.indexOf(i) >= 0 ? model_color : '#555';
                const cx = MARGIN_LEFT + i * SET_NAME_AREA + CONDITIONED_MODEL_RADIUS + 10;
                // model circle
                root_info_area.append('circle')
                    .attrs({
                        cx: cx,
                        cy: cy,
                        r: r,
                        fill: c
                    })
                    .classed('analysis_vis', true)
                    .classed('improve-case-bar-chart', true);
            }

            // draw bar
            const x = MARGIN_LEFT + 5 * SET_NAME_AREA + 20;
            const y = MARGIN_TOP + yi * CASE_SET_BAR_HEIGHT_AREA;
            const width = (number_of_items / MAX_SET_BAR_VALUE) * MAX_SET_BAR_WIDTH;
            root_info_area.append('rect')
                .attrs({
                    x: x,
                    y: y,
                    width: width,
                    height: CASE_SET_BAR_HEIGHT_FILL,
                    fill: CONSTANT.COLORS['improve']
                })
                .classed('analysis_vis', true)
                .classed('improve-case-bar-chart', true)
                .on('mousedown',function () {
                    drawDigits(condition.digit, e.imgs_idx);
                });

            // 가로 그리드
            root_info_area.append('line')
                .attrs({
                    x1: 0,
                    x2: WIDTH,
                    y1: y - (CASE_SET_BAR_HEIGHT_AREA - CASE_SET_BAR_HEIGHT_FILL) / 2,
                    y2: y - (CASE_SET_BAR_HEIGHT_AREA - CASE_SET_BAR_HEIGHT_FILL) / 2,
                    stroke: '#ccc'
                });



        })
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

    function drawDigits(digit, imgs_idx) {
        root_scroll_area.selectAll(".analysis_vis.digit").remove();

        let col = 0;

        _.forEach(imgs_idx, (img_idx, i) => {
            const row = i % NUM_OF_CELLS_IN_ROW;

            const file_dir = "./data/mnist_png_testing/" + digit + "/" + digit + "_" + (img_idx + 1) + ".png";
            root_scroll_area.append('image')
                .attrs({
                    "xlink:href": file_dir,
                    x: CELL_SIZE * row + 1,
                    y: CELL_SIZE * col + 1,
                    width: IMG_LEN - 2,
                    height: IMG_LEN - 2,
                })
                .classed("analysis_vis", true)
                .classed("digit", true);

            if ((i + 1) % NUM_OF_CELLS_IN_ROW === 0) {
                col += 1;
            }
        });
    }

    return that;
}
