# axon-js
A toy neural network library implemented in Javscript. 

Written from scratch from learning purposes. Currently features
only a simple 3 layer feed-forward network. 

![screenshot](https://sethpipho.github.io/axon-js/demos/mnist/screenshot.png)

[Live Demo](https://sethpipho.github.io/axon-js/demos/mnist/)


### Usage

```javacript
// demos/xor/main.js

let params = {
    input_size: 2,
    hidden_size: 5,
    hidden_activation:'sigmoid',
    output_size: 2,
    output_activation: 'softmax'
}

let nn = new Axon.FeedForwardNN(params)

let x = [
            [0,0],
            [1,0],
            [0,1],
            [1,1],
            
        ]

let y = [
            [1,0],
            [0,1],
            [0,1],
            [1,0]
        ]
nn.train(x,y, 3, 100, 'cross-entropy', 4)

let prediction = nn.predict(x)
console.log(prediction)
```
