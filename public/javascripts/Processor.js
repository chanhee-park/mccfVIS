const Processor = new function () {

    this.getPerformances = function (model_names) {
        let ret = {};

        _.forEach(model_names, (model_name) => {
            ret[model_name] = {};

            const model_prediction = DATA.MODELS_PREDICTION[model_name];

            let num_of_correct_by_digit = _.fill(new Array(10), 0);
            _.forEach(model_prediction, (m) => {
                const digit = m[0];
                const predict = m[1];
                const isCorrect = digit === predict;

                if (isCorrect) {
                    num_of_correct_by_digit[digit] = num_of_correct_by_digit[digit] + 1
                }
            });

            _.forEach(num_of_correct_by_digit, (e, digit) => {
                let performance_by_digit = e / 1000;
                ret[model_name][digit] = {
                    'true': performance_by_digit,
                    'false': 1 - performance_by_digit,
                }
            });
        });

        return ret;
    };

    this.getPredictionChangeInfo = function (base_model_name) {
        let ret = {};

        let base_result = DATA.MODELS_PREDICTION[base_model_name];

        _.forEach(CONSTANT.MODEL_NAMES, (model_name) => {
            ret[model_name] = {};

            let result = DATA.MODELS_PREDICTION[model_name];

            let both_correct = _.fill(new Array(10), 0);
            let improve = _.fill(new Array(10), 0);
            let both_wrong = _.fill(new Array(10), 0);
            let worsen = _.fill(new Array(10), 0);

            _.forEach(result, (r, i) => {
                const digit = r[0];

                const base_model_predict = base_result[i][1];
                const predict = r[1];

                const is_base_model_correct = digit === base_model_predict;
                const is_correct = digit === predict;

                if (is_base_model_correct && is_correct) {
                    both_correct[digit] = both_correct[digit] + 1
                } else if (!is_base_model_correct && is_correct) {
                    improve[digit] = improve[digit] + 1
                } else if (is_base_model_correct && !is_correct) {
                    worsen[digit] = worsen[digit] + 1
                } else {
                    both_wrong[digit] = both_wrong[digit] + 1
                }
            });

            for (let digit = 0; digit < 10; digit++) {
                ret[model_name][digit] = {
                    'improve': improve[digit] / 1000,
                    'correct-both': both_correct[digit] / 1000,
                    'wrong-both': both_wrong[digit] / 1000,
                    'worsen': worsen[digit] / 1000,
                    'true': (both_correct[digit] + improve[digit]) / 1000,
                    'false': (both_wrong[digit] + worsen[digit]) / 1000,
                }
            }
        });

        return ret;
    };

    this.getDiagnosisMatrix = function (base_model_name) {
        let base_result = DATA.MODELS_PREDICTION[base_model_name];

        let err_matrix = [];

        for (let digit = 0; digit < 10; digit++) {
            err_matrix[digit] = _.fill(new Array(10), 0);
        }

        _.forEach(base_result, (res) => {
            const digit = res[0];
            const base_predict = res[1];
            const is_base_model_correct = digit === base_predict;

            if (!is_base_model_correct) {
                err_matrix[digit][base_predict] = err_matrix[digit][base_predict] + 1;
            }
        });

        return err_matrix;
    };

    this.getImporveInfoMatrix = function (base_model_name) {
        let base_result = DATA.MODELS_PREDICTION[base_model_name];
        let other_model_names = [];
        let ret = [];

        _.forEach(CONSTANT.MODEL_NAMES, (model_name) => {
            if (model_name !== base_model_name) {
                other_model_names.push(model_name);
            }
        });

        for (let d = 0; d < 10; d++) {
            ret[d] = _.fill(new Array(10), []);
            for (let p = 0; p < 10; p++) {
                let e = {};
                _.forEach(other_model_names, (model_name) => {
                    e[model_name] = 0;
                });
                ret[d][p] = e;
            }
        }

        _.forEach(base_result, (res, i) => {
            let digit = res[0];
            let base_pred = res[1];
            if (digit !== base_pred) {
                _.forEach(other_model_names, (model_name) => {
                    let compare_result = DATA.MODELS_PREDICTION[model_name];
                    if (digit === compare_result[i][1]) {
                        ret[digit][base_pred][model_name]++;
                    }
                });
            }
        });

        return ret;
    };

    this.getImgsIdx = function (condition) {
        const c_model_name = condition.model_name;
        const c_digit = condition.digit;
        const c_predict = condition.predict;

        let result = DATA.MODELS_PREDICTION[c_model_name];
        result = result.slice(c_digit * 1000, c_digit * 1000 + 1000);

        const idxs = [];

        _.forEach(result, (r, idx) => {
            const d = r[0];
            const p = r[1];
            if (d === c_digit && p === c_predict) {
                idxs.push(idx)
            }
        });

        return idxs;
    };

    this.getAvgFromJson = function (json) {
        let values = _.values(json);
        return _.mean(values);
    };

    return this;
};