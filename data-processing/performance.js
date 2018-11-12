let fs = require('fs');
let _ = require('lodash');

let ret = {};
const model_names = ['knn', 'neural_network', 'random_forest', 'softmax_regression', 'stacked_autoencoder'];

_.forEach(model_names, (model_name) => {
    ret[model_name] = {};
    let filename = './result/' + model_name + '.json';

    let result = JSON.parse(fs.readFileSync(filename));

    let num_of_correct_by_digit = _.fill(new Array(10), 0);
    _.forEach(result, (r) => {
        const digit = r[0];
        const predict = r[1];
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

console.log(ret);

