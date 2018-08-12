/**
 * Basic 2D Matrix math class
 */

export class Mx {
    constructor(rows, cols) {
        this.rows = rows
        this.cols = cols
        this.array = Array(rows * cols).fill(0)
    }

    static fromArray(arr) {
        let rows = arr.length
        let cols = arr[0].length
        let matrix = new Mx(rows, cols)

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                matrix.array[row * cols + col] = arr[row][col]
            }
        }
        return matrix
    }

    static fromDims(rows, cols) {
        return new Mx(rows, cols)
    }

    fill(num) {
        this.array.fill(num)
    }

    toString(digits) {
        let result = ""
        let max_length = 0
        let number_strs = []

        for (let i = 0; i < this.rows * this.cols; i++) {
            let str = this.array[i].toFixed(digits)
            if (str.length > max_length) {
                max_length = str.length
            }
            number_strs.push(str)
        }

        for (let i = 0; i < this.rows * this.cols; i++) {
            if (i % this.cols == 0) {
                result += "\n"
            }
            result += number_strs[i].padStart(max_length) + "  "
        }
        return result
    }

    toArray() {
        let result = []
        for (let row = 0; row < this.rows; row++) {
            result.push([])
            for (let col = 0; col < this.cols; col++) {
                result[row].push(this.array[row * this.cols + col])
            }
        }
        return result
    }

    static add(a, b) {
        //identical dimesions
        if (a.rows == b.rows && a.cols == b.cols) {
            let result = Mx.fromDims(a.rows, a.cols)
            for (let i = 0; i < a.rows * a.cols; i++) {
                result.array[i] = a.array[i] + b.array[i]
            }
            return result
        }

        //one matrix has only on col,add columwise
        if ((a.cols == 1 || b.cols == 1) && (a.rows == b.rows)) {
            if (a.cols == 1){
               let temp = a
               a = b
               b = temp
            }

            let result = Mx.fromDims(a.rows, a.cols)
            for (let row = 0; row < a.rows; row++) {
                for (let col = 0; col < a.cols; col++) {
                    result.array[a.cols * row + col] = a.array[a.cols * row + col] + b.array[row]
                }
            }
            return result
        }
        throw "Matrices are not compatatible";
    }


    static sub(a, b) {
        if (a.rows == b.rows && a.cols == b.cols) {
            let result = Mx.fromDims(a.rows, a.cols)
            for (let i = 0; i < a.rows * a.cols; i++) {
                result.array[i] = a.array[i] - b.array[i]
            }
            return result
        }
        throw "Matrices are not compatatible";
    }

    static multiplyElems(a, b) {
        if (a.rows == b.rows && a.cols == b.cols) {
            let result = Mx.fromDims(a.rows, a.cols)
            for (let i = 0; i < a.rows * a.cols; i++) {
                result.array[i] = a.array[i] * b.array[i]
            }
            return result
        }
        throw "Matrices are not compatatible";
    }

    static scale(matrix, scale) {
        let result = Mx.fromDims(matrix.rows, matrix.cols)
        for (let i = 0; i < matrix.rows * matrix.cols; i++) {
            result.array[i] = matrix.array[i] * scale
        }
        return result
    }

    static multiply(a, b, result) {
        if (a.cols == b.rows) {
            let result = Mx.fromDims(a.rows, b.cols)
            for (let row = 0; row < a.rows; row++) {
                for (let col = 0; col < b.cols; col++) {
                    let sum = 0
                    for (let k = 0; k < a.cols; k++) {
                        sum += a.array[row * a.cols + k] * b.array[k * b.cols + col]
                    }
                result.array[b.cols * row + col] = sum
                }
            }
            return result
        }
        throw "Matrices are not compatatible";
    }

    static map(input, f) {
        let result = Mx.fromDims(input.rows, input.cols)
        for (let i = 0; i < input.array.length; i++) {
            result.array[i] = f(input.array[i])
        }
        return result
    }

    static transpose(input) {
        let  result = Mx.fromDims(input.cols, input.rows)
        for (let row = 0; row < input.rows; row++) {
            for (let col = 0; col < input.cols; col++) {
                result.array[col * input.rows + row] = input.array[row * input.cols + col]
            }
        }
        return result
    }

 
    static sum(input, axis) {
        if (axis == undefined){
            let sum = 0
            for (let i = 0; i < input.rows * input.cols; i++) {
                sum += input.array[i]
            }
            return sum
        } else if (axis == "cols"){
            let sum = Mx.fromDims(1, input.cols)
            for (let row = 0; row < input.rows; row++) {
                for (let col = 0; col < input.cols; col++) {
                    sum.array[col] += input.array[input.cols * row + col] 
                }
            }
            return sum
        } else if (axis == "row"){
            let sum = Mx.fromDims(input.rows, 1)
            for (let row = 0; row < input.rows; row++) {
                for (let col = 0; col < input.cols; col++) {
                    sum.array[row] += input.array[input.cols * row + col] 
                }
            }
            return sum
        }  
    }

    static max(input) {
        let max = input.array[0]
        for (let i = 0; i < input.rows * input.cols; i++) {
            if (input.array[i] > max) {
                max = input.array[i]
            }
        }
        return max
    }

    static mean(input) {
        return this.sum(input) / input.array.length
    }


    static rowSum(input) {

        let sum = Mx.fromDims(input.rows, 1)

        for (let row = 0; row < input.rows; row++) {
            for (let col = 0; col < input.cols; col++) {
                sum.array[row] += input.array[input.cols * row + col] 
            }
        }
        return sum
    }

    static colSum(input) {

        let sum = Mx.fromDims(1, input.cols)

        for (let row = 0; row < input.rows; row++) {
            for (let col = 0; col < input.cols; col++) {
                sum.array[col] += input.array[input.cols * row + col] 
            }
        }
        return sum
    }

    static scaleCols(input,scale){
        let result = Mx.fromDims(input.rows, input.cols)

        for (let row = 0; row < input.rows; row++) {
            for (let col = 0; col < input.cols; col++) {
               result.array[result.cols * row + col] = input.array[input.cols * row + col] * scale.array[col] 
            }
        }
        return result
    }


   
}