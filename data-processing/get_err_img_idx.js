let fs = require('fs');
let _ = require('lodash');

let ret = {};
const model_names = ['knn', 'neural_network', 'random_forest', 'softmax_regression', 'stacked_autoencoder'];

function get_err_idxs(model_result, digit, predict) {
    const idxs = [];
    for (let i = 0; i < model_result.length; i++) {
        const r = model_result[i];
        if (parseInt(r[0]) === digit && parseInt(r[1]) === predict) {
            const file_name = 'mnist_png_testing/' + digit + '/' + ((digit + '_' + i % 1000) + 1) + '.png';
            idxs.push(file_name);
        }
    }
    return idxs;
}

_.forEach(model_names, (model_name) => {
    ret[model_name] = {};

    let filename = './result/' + model_name + '.json';
    let result = JSON.parse(fs.readFileSync(filename));

    for (let digit = 0; digit < 10; digit++) {
        for (let predict = 0; predict < 10; predict++) {
            if (digit !== predict) {
                const idxs = get_err_idxs(result, digit, predict);
                if (idxs.length > 0) {
                    ret[model_name][digit + ":" + predict] = idxs;
                }
            }
        }
    }
});

fs.writeFileSync('./err_img_idx.json', JSON.stringify(ret, null, 4));