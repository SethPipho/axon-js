import {Mx} from "./matrix.js"

export const ActivationFunctions = {
     'sigmoid': function (input, derivative) {
        if (derivative) {
            return Mx.map(input, (x) => x * (1 - x))
        }
        return Mx.map(input, (x) => 1 / (1 + Math.pow(Math.E, -x)))
    },

    'relu': function (input, derivative) {
        if (derivative) {
            return Mx.map(input, (x) => (x > 0) ? 1 : 0)
        }
        return Mx.map(input, (x) => (x > 0) ? x : 0, 6)
    },

    'softmax': function (input, derivative) {
        if (derivative) {
            return Mx.map(input, (x) => x * (1 - x))
        }
     
        let x_exp = Mx.map(input, (x) => Math.pow(Math.E, x ))
        let x_exp_sum = Mx.colSum(x_exp)
        return Mx.scaleCols(x_exp, Mx.map(x_exp_sum,(x) => 1/x) )
    }
}