

let params = {
    input_size: 2,
    hidden_size: 5,
    hidden_activation:'sigmoid',
    output_size: 1,
    output_activation: 'sigmoid'
}

let nn = new Axon.FeedForwardNN_V2(params)


let x = [
            [0,0],
            [1,0],
            [0,1],
            [1,1],
            
        ]


let y = [
            [0],
            [1],
            [1],
            [0]
        ]


nn.train(x,y, 5, 100, 'cross-entropy', 4)

let prediction = nn.predict(x)

console.log(prediction.map(x => Math.round(x * 100)/100).toString() )

//console.log(Axon.Mx.rowSum(Axon.Mx.fromArray(x)).toString(2))