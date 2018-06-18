import {Mx} from "./matrix.js"
import {ActivationFunctions} from "./activation-functions.js"
import {rand_guassian} from "./util.js"

export class FeedForwardNN {
    constructor(params) {

        if (params == undefined) {
            return
        }

        this.params = params
        this.hidden_weights = Mx.fromDims(params.hidden_size, params.input_size)
        this.hidden_bias = Mx.fromDims(params.hidden_size, 1)
        this.hidden_activation_f = ActivationFunctions[params.hidden_activation]

        this.output_weights = Mx.fromDims(params.output_size, params.hidden_size)
        this.output_bias = Mx.fromDims(params.output_size, 1)
        this.output_activation_f = ActivationFunctions[params.output_activation]

        this.hidden_activation;
    }

    export () {

        return {
            params: this.params,
            hidden_weights: this.hidden_weights.toArray(),
            hidden_bias: this.hidden_bias.toArray(),
            output_weights: this.output_weights.toArray(),
            output_bias: this.output_bias.toArray()
        }
    }

    import (model) {
        this.params = model.params
        this.hidden_weights = Mx.fromArray(model.hidden_weights)
        this.hidden_bias = Mx.fromArray(model.hidden_bias)
        this.output_weights = Mx.fromArray(model.output_weights)
        this.output_bias = Mx.fromArray(model.output_bias)

        this.hidden_activation_f = ActivationFunctions[model.params.hidden_activation]
        this.output_activation_f = ActivationFunctions[model.params.output_activation]
    }


    predict(x) {
        x = Mx.transpose(Mx.fromArray(x))
        let hidden_activation = this.hidden_activation_f(Mx.add(Mx.multiply(this.hidden_weights, x), this.hidden_bias), false)
        let output_activation = this.output_activation_f(Mx.add(Mx.multiply(this.output_weights, hidden_activation), this.output_bias), false)
        //for visualization purposes
        this.hidden_activation = hidden_activation;
        return Mx.transpose(output_activation).toArray()
    }

    train(x, y, learn_rate, epochs, loss_function, batch_size) {

        //creatre mini-batches
        let batches_x = []
        let batches_y = []

        for (let i = 0; i < x.length; i += batch_size) {
            let batch_x = x.slice(i, i + batch_size)
            let batch_y = y.slice(i, i + batch_size)
            batches_x.push(Mx.transpose(Mx.fromArray(batch_x)))
            batches_y.push(Mx.transpose(Mx.fromArray(batch_y)))
        }

        //init weights
        this.hidden_weights = Mx.map(this.hidden_weights, () => rand_guassian() * Math.sqrt(2 / this.params.input_size))
        this.output_weights = Mx.map(this.output_weights, () => rand_guassian() * Math.sqrt(2 / this.params.hidden_size))

        this.hidden_bias = Mx.map(this.hidden_bias, () => .1)
        this.output_bias = Mx.map(this.output_bias, () => .1)

        for (let epoch = 1; epoch <= epochs; epoch++) {
            let loss_sum = 0
            for (let batch in batches_x) {

                let _x = batches_x[batch]
                let _y = batches_y[batch]

                //feed forward
                let hidden_activation = this.hidden_activation_f(Mx.add(Mx.multiply(this.hidden_weights, _x), this.hidden_bias), false)
                let output_activation = this.output_activation_f(Mx.add(Mx.multiply(this.output_weights, hidden_activation), this.output_bias), false)

                //error derivative
                let error = Mx.sub(_y, output_activation)

                let out_grad;
                //gradient for output layer 
                if (loss_function == "cross-entropy") {
                    out_grad = error
                    loss_sum += (Mx.sum(Mx.map(error, (y) => (y > 0) ? -Math.log(1 - y) : -Math.log(y + 1))))

                } else if (loss_function == "mean-squared") {
                    let slope_out = this.hidden_activation_f(output_activation, true)
                    out_grad = Mx.multiplyElems(error, slope_out)

                    loss_sum += (Mx.sum(Mx.multiplyElems(error, error)))
                }

                //gradient for hidden layer
                let hidden_error = Mx.multiply(Mx.transpose(this.output_weights), out_grad)
                let slope_hidden = this.output_activation_f(hidden_activation, true)
                let hidden_grad = Mx.multiplyElems(hidden_error, slope_hidden)

                //gradient for each weight
                let output_weights_grad = Mx.multiply(out_grad, Mx.transpose(hidden_activation))
                let hidden_weights_grad = Mx.multiply(hidden_grad, Mx.transpose(_x))

                //update weights
                this.output_weights = Mx.add(this.output_weights, Mx.scale(output_weights_grad, learn_rate * 1 / batch_size))
                this.hidden_weights = Mx.add(this.hidden_weights, Mx.scale(hidden_weights_grad, learn_rate * 1 / batch_size))

                //update biases
                this.output_bias = Mx.add(this.output_bias, Mx.scale(Mx.rowSum(out_grad), learn_rate * 1 / batch_size))
                this.hidden_bias = Mx.add(this.hidden_bias, Mx.scale(Mx.rowSum(hidden_grad), learn_rate * 1 / batch_size))

            }
            let loss = loss_sum / (batches_x.length * batch_size)
            console.log("epoch:", epoch + "/" + epochs, "loss:", loss)
        }
    }
}



