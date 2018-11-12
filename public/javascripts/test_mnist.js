let set = mnist.set(8000, 2000);
let trainSet = set.train;
let testSet = set.test;

let context = document.getElementById('myCanvas').getContext('2d');
let docValue = document.getElementById('value');
for (let i = 0; i < 1000; i++) {
    setTimeout(() => {
        let digit = testSet[i].input;
        if (oneHotVec(testSet[i].output) === 0) {
            docValue.innerText = oneHotVec(testSet[i].output);
            console.log({ input: testSet[i].input, output: testSet[i].output });
            mnist.draw(digit, context);
        }
    }, 300 * i)
}

function oneHotVec(arr) {
    return _.indexOf(arr, _.max(arr));
}