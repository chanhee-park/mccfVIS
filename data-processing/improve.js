let fs = require('fs');
let _ = require('lodash');

let ret = {};

const base_model_name = 'knn';
const base_model_filename = './result/' + base_model_name + '.json';
let base_result = JSON.parse(fs.readFileSync(base_model_filename));

const model_names = ['knn', 'neural_network', 'random_forest', 'softmax_regression', 'stacked_autoencoder'];

_.forEach(model_names, (model_name) => {
    ret[model_name] = {};
    let filename = './result/' + model_name + '.json';

    let result = JSON.parse(fs.readFileSync(filename));

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
            'correct-both': both_correct[digit] / 1000,
            'improve': improve[digit] / 1000,
            'worsen': worsen[digit] / 1000,
            'wrong-both': both_wrong[digit] / 1000
        }
    }
});

console.log(ret);

