

let params = {
    input_size: 2,
    hidden_size: 3,
    hidden_activation:'sigmoid',
    output_size: 1,
    output_activation: 'sigmoid'
}

let nn = new Axon.FeedForwardNN(params)


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


nn.train(x,y, 5, 100, 'cross-entropy', 1)

let prediction = nn.predict(x)

console.log(prediction )

//console.log(Axon.Mx.colSum(Axon.Mx.fromArray(x)).toString())

//console.log(Axon.Mx.scaleCols(Axon.Mx.fromArray(x), Axon.Mx.fromArray([[.5,.3]])).toString(2))

//console.log(Axon.Mx.rowSum(Axon.Mx.fromArray(x)).toString(2))