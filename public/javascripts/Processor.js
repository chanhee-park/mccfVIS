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
                    'false': 1 - performance_by_digit
                }
            });
        });

        return ret;
    }
};