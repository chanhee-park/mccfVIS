function instanceAnalysisVis() {
    let that = this;

    const root_info_area = d3.select('#instance-analysis-vis');
    const root_scroll_area = d3.select('#instance-analysis-vis__scroll-area');

    const WIDTH = 374;
    const INFO_AREA_HEIGHT = 621;
    let SCROLL_AREA_HEIGHT = 300;

    const MARGIN_LEFT = 20;

    const VIEW_WIDTH = WIDTH - MARGIN_LEFT;
    const AVG_IMG_LEN = VIEW_WIDTH - 90;

    const MARGIN_TOP = 120 + AVG_IMG_LEN;

    const NUM_OF_CELLS_IN_ROW = 6;
    const CELL_SIZE = WIDTH / NUM_OF_CELLS_IN_ROW;
    const IMG_LEN = CELL_SIZE;

    const MODEL_NAME_AREA = 100;
    const BARCODE_HEIGHT_AREA = 40;
    const BARCODE_HEIGHT_FILL = BARCODE_HEIGHT_AREA * 0.7;
    const MAX_BARCODE_WIDTH = WIDTH - MARGIN_LEFT - MODEL_NAME_AREA - 20;

    const DIGIT_VIEW_TITLE_HEIGHT = 60;

    let imgs_idx = [];


    drawTitles();
    drawBarcodeGrid();

    this.drawInstanceList = function (condition) {
        imgs_idx = Processor.getImgsIdx(condition);
        SCROLL_AREA_HEIGHT = Math.ceil(imgs_idx.length / NUM_OF_CELLS_IN_ROW) * CELL_SIZE + DIGIT_VIEW_TITLE_HEIGHT;
        d3.select('#instance-analysis-vis__scroll-area').style('height', SCROLL_AREA_HEIGHT);
        drawConditionInfo(condition);

        drawAvgImg(condition.model_name, condition.digit, condition.predict);
        drawImproveBarcode(condition);

        drawDigits(condition.digit, imgs_idx);
    };


    function drawTitles() {
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

        root_info_area.append('text')
            .text("DIGITS")
            .attrs({
                x: MARGIN_LEFT,
                y: INFO_AREA_HEIGHT - DIGIT_VIEW_TITLE_HEIGHT / 2,
                fill: '#555',
                'text-anchor': 'start',
                'alignment-baseline': 'hanging',
                'font-size': CONSTANT.FONT_SIZE.default,
                'font-weight': 900,
            });
    }

    function drawBarcodeGrid() {
        // col 1 : model
        let x = MARGIN_LEFT;
        let y = MARGIN_TOP - 10;
        root_info_area.append('text')
            .text('Model')
            .attrs({
                x: x + 10,
                y: y,
                'font-size': CONSTANT.FONT_SIZE.default,
                fill: '#555',
                'text-anchor': 'middle',
                'alignment-baseline': 'ideographic',
            })
            .classed('grid');

        root_info_area.append('line')
            .attrs({
                x1: MARGIN_LEFT + 40,
                x2: MARGIN_LEFT + 40,
                y1: y - 20,
                y2: INFO_AREA_HEIGHT - DIGIT_VIEW_TITLE_HEIGHT + 14,
                stroke: '#ccc'
            });

        // col 2 : Number of Improvement Items
        x = MARGIN_LEFT + 70;
        y = MARGIN_TOP - 10;
        root_info_area.append('text')
            .text('Items')
            .attrs({
                x: x + 5,
                y: y,
                'font-size': CONSTANT.FONT_SIZE.default,
                fill: '#555',
                'text-anchor': 'middle',
                'alignment-baseline': 'ideographic',
            })
            .classed('grid');

        root_info_area.append('line')
            .attrs({
                x1: x + 40,
                x2: x + 40,
                y1: y - 20,
                y2: INFO_AREA_HEIGHT - DIGIT_VIEW_TITLE_HEIGHT + 14,
                stroke: '#ccc'
            });

        // col 3 : Improvement Barcode
        x = MARGIN_LEFT + 230;
        y = MARGIN_TOP - 10;
        root_info_area.append('text')
            .text('Improvement Barcode')
            .attrs({
                x: x + 5,
                y: y,
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
                y1: MARGIN_TOP - 30,
                y2: MARGIN_TOP - 30,
                stroke: '#ccc',
            });
        root_info_area.append('line')
            .attrs({
                x1: 0,
                x2: WIDTH,
                y1: y,
                y2: y,
                stroke: '#ccc',
            });

        _.forEach(CONSTANT.MODEL_NAMES, (model_name, row) => {
            const bar_y = MARGIN_TOP + row * BARCODE_HEIGHT_AREA - 10;
            let stroke_color = row === 4 ? '#333' : '#ccc';
            root_info_area.append('line')
                .attrs({
                    x1: 0,
                    x2: WIDTH,
                    y1: bar_y + BARCODE_HEIGHT_AREA,
                    y2: bar_y + BARCODE_HEIGHT_AREA,
                    stroke: stroke_color,
                })
        });
    }

    function drawImproveBarcode(condition, sorting_model) {
        root_info_area.selectAll(".analysis_vis.barcode").remove();

        let imgs_idx = Processor.getImgsIdx(condition);
        if (sorting_model !== undefined) {
            imgs_idx = Processor.SortImgByModelPrediction(condition.digit, imgs_idx, sorting_model);
        }
        const barcode_start_x = MARGIN_LEFT + MODEL_NAME_AREA + 10;

        _.forEach(CONSTANT.MODEL_NAMES, (model_name, row) => {
            const bar_y = MARGIN_TOP + row * BARCODE_HEIGHT_AREA - 10;
            root_info_area.append('text')
                .text(CONSTANT.MODEL_NAMES_TO_DRWA[model_name])
                .attrs({
                    x: MARGIN_LEFT - 7,
                    y: bar_y + BARCODE_HEIGHT_AREA / 2,
                    'text-anchor': 'start',
                    'alignment-baseline': 'start',
                    fill: '#333'
                })
                .classed('analysis_vis', true)
                .classed("barcode", true)
                .on('mousedown', function () {
                    drawImproveBarcode(condition, model_name)
                });
        });

        let number_of_items = [0, 0, 0, 0, 0];
        _.forEach(imgs_idx, (img_idx, col) => {
            const bar_x = barcode_start_x + col * (MAX_BARCODE_WIDTH / imgs_idx.length);
            _.forEach(CONSTANT.MODEL_NAMES, (model_name, row) => {
                const bar_y = MARGIN_TOP - 10 + row * BARCODE_HEIGHT_AREA + (BARCODE_HEIGHT_AREA - BARCODE_HEIGHT_FILL) / 2;
                const r = DATA.MODELS_PREDICTION[model_name][condition.digit * 1000 + img_idx];
                const d = r[0];
                const p = r[1];
                if (d === p) {
                    number_of_items[row]++;
                    root_info_area.append('rect')
                        .attrs({
                            x: bar_x,
                            y: bar_y,
                            width: MAX_BARCODE_WIDTH / imgs_idx.length,
                            height: BARCODE_HEIGHT_FILL,
                            fill: CONSTANT.COLORS['improve']
                        })
                        .classed('analysis_vis', true)
                        .classed("barcode", true);
                }
            });
        });

        _.forEach(number_of_items, (e, yi) => {
            const bar_y = MARGIN_TOP + yi * BARCODE_HEIGHT_AREA + (BARCODE_HEIGHT_AREA - BARCODE_HEIGHT_FILL) / 2;
            root_info_area.append('text')
                .text(e)
                .attrs({
                    x: MARGIN_LEFT + 60,
                    y: bar_y,
                    'font-size': CONSTANT.FONT_SIZE.default,
                    'text-anchor': 'center',
                    'alignment-baseline': 'middle',
                    'fill': '#333'
                })
                .classed('analysis_vis', true)
                .classed("barcode", true);
        });
    }

    function drawConditionInfo(condition) {
        root_info_area.selectAll(".analysis_vis.title").remove();
        const title = CONSTANT.MODEL_NAMES_TO_DRWA[condition.model_name]
            + "  | Digit : " + condition.digit
            + "  | Predict : " + condition.predict
            + "  | " + Processor.getImgsIdx(condition).length + " Items";

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
                    x: CELL_SIZE * row + 2,
                    y: CELL_SIZE * col + 2,
                    width: IMG_LEN - 4,
                    height: IMG_LEN - 4,
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
