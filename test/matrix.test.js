const ml = require('../build/axon.build.js')
const Mx = ml.Mx

test('Create Matrix From Dimensions', () => {
    let matrix = Mx.fromDims(2,4)
    expect(matrix.rows).toBe(2);
    expect(matrix.cols).toBe(4);
    expect(matrix.array.length).toBe(2 * 4);
  });


  test('Create Matrix From Array', () => {
    let arr =   [[1,2,3],[4,5,6]]
    let matrix = Mx.fromArray(arr)
    expect(matrix.rows).toBe(2);
    expect(matrix.cols).toBe(3);
    expect(matrix.array).toEqual([1,2,3,4,5,6]);
  });

  test('Fill Matrix', () => {
    let matrix = Mx.fromDims(2,3)
    matrix.fill(4)
    expect(matrix.array).toEqual([4,4,4,4,4,4]);
  });

  test('Create Array From Array', () => {
    let arr =   [[1,2,3],[4,5,6]]
    let matrix = Mx.fromArray(arr)
    expect(matrix.toArray()).toEqual(arr);
  });

  test('Add Matrices of same dimension', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let m2 = Mx.fromArray([[7,8,9],[10,11,12]])
    let sum = Mx.fromArray([[8,10,12], [14,16,18]])

    expect(Mx.add(m1,m2)).toEqual(sum);
  })

  test('Add Matrices where one matrices has only one column', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let m2 = Mx.fromArray([[7],[8]])
    let sum = Mx.fromArray([[8,9,10], [12,13,14]])

    expect(Mx.add(m1,m2)).toEqual(sum);
    expect(Mx.add(m2,m1)).toEqual(sum);
  })


  test('Subtract Matrices of same dimension', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let m2 = Mx.fromArray([[1,0,5],[3,10,5]])
    let diff = Mx.fromArray([[0,2,-2], [1,-5,1]])

    expect(Mx.sub(m1,m2)).toEqual(diff);
  })

  test('Elementwise Multiplication', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let m2 = Mx.fromArray([[7,8,9],[10,11,12]])
    let product = Mx.fromArray([[7,16,27], [40,55,72]])

    expect(Mx.multiplyElems(m1,m2)).toEqual(product);
  })


  test('Scale Matrices', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let scaled = Mx.fromArray([[3,6,9], [12,15,18]])

    expect(Mx.scale(m1,3)).toEqual(scaled);
  })

  test('Multiply 2 Matrices', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let m2 = Mx.fromArray([[7,8],[9,10],[11,12]])
    let result = Mx.fromArray([[58,64],[139,154]])

    expect(Mx.multiply(m1,m2)).toEqual(result);
  })

  test('map function across matrix', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let f = (x) => {return 3 * x}
    let result = Mx.fromArray([[3,6,9], [12,15,18]])

    expect(Mx.map(m1,f)).toEqual(result);
  })

  test('Transpose Matrices', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let result = Mx.fromArray([[1,4],[2,5],[3,6]])

    expect(Mx.transpose(m1)).toEqual(result);
  })

  test('sum matrices', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    expect(Mx.sum(m1)).toEqual(21);
  })

  test('sum cols', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let result = Mx.fromArray([[5,7,9]])
    expect(Mx.sum(m1, 'cols')).toEqual(result);
  })

  test('sum rows', () => {
    let m1 = Mx.fromArray([[1,2,3],[4,5,6]])
    let result = Mx.fromArray([[6],[15]])
    expect(Mx.sum(m1, 'row')).toEqual(result);
  })

  test('mean', () => {
    let m1 = Mx.fromArray([[2,4],[5,1]])
    expect(Mx.mean(m1)).toEqual(3);
  })

  test('max', () => {
    let m1 = Mx.fromArray([[2,4],[5,1]])
    expect(Mx.max(m1)).toEqual(5);
  })


  



