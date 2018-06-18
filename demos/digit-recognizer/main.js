
let nn = new Axon.FeedForwardNN()

fetch('../mnist/model.json')
        .then((response) =>{
            response.json()
                .then((data) => {
                    nn.import(data)
                    console.log("model imported")
                })
        })


//Interface Stuff
////////////////////////////////////////////////////////////////////////////////////////////////

let UI = {
    drawCanvas:document.getElementById("canvas"),
    drawCtx:document.getElementById("canvas").getContext('2d'),

    previewCanvas:document.getElementById("preview"),
    previewCtx:document.getElementById("preview").getContext('2d'),

    predictBtn:document.getElementById("predict-btn"),
    clearBtn:document.getElementById('clear-btn'),

    predictSpan:document.getElementById('predict-span'),

    mouseDown: false,
    mousePos:{
        x:0,
        y:0
    }
}

UI.drawCanvas.width = 225
UI.drawCanvas.height = 225

UI.previewCanvas.width = 28
UI.previewCanvas.height = 28

UI.drawCtx.lineWidth = 15
UI.drawCtx.lineCap = "round"
UI.drawCtx.strokeStyle = "rgb(255,255,255)"

clear()

UI.drawCanvas.addEventListener("mousedown", onMouseDown)
UI.drawCanvas.addEventListener("mouseup", onMouseUp)
UI.drawCanvas.addEventListener("mouseleave", onMouseLeave)
UI.drawCanvas.addEventListener("mousemove", onMouseMove)

UI.drawCanvas.addEventListener("touchstart", onTouchStart)
UI.drawCanvas.addEventListener("touchend", onTouchEnd)
UI.drawCanvas.addEventListener("touchmove", onTouchMove)
UI.drawCanvas.addEventListener("touchLeave", onTouchLeave)

UI.predictBtn.addEventListener("click", predict)
UI.clearBtn.addEventListener("click", clear)



function onMouseDown(event){
    event.preventDefault()

    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    UI.mouseDown = true
    UI.mousePos.x = x
    UI.mousePos.y = y
}

function onMouseMove(event){
   event.preventDefault()

    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    if ( UI.mouseDown){
        UI.drawCtx.beginPath()
        UI.drawCtx.moveTo(UI.mousePos.x, UI.mousePos.y)
        UI.drawCtx.lineTo(x,y)
        UI.drawCtx.stroke()
    }

    UI.mousePos.x = x
    UI.mousePos.y = y

}

function onMouseUp(event){
    event.preventDefault()
    UI.mouseDown = false
}

function onMouseLeave(event){
     event.preventDefault()
     UI.mouseDown = false
}

function onTouchStart(event){
    event.preventDefault()

    let rect = event.target.getBoundingClientRect();
    let x = event.touches[0].clientX - rect.left
    let y = event.touches[0].clientY - rect.top

    UI.mouseDown = true
    UI.mousePos.x = x
    UI.mousePos.y = y

}

function onTouchMove(event){
    event.preventDefault()

    let rect = event.target.getBoundingClientRect();
    let x = event.touches[0].clientX - rect.left
    let y = event.touches[0].clientY - rect.top

    if (UI.mouseDown){
        UI.drawCtx.beginPath()
        UI.drawCtx.moveTo(UI.mousePos.x, UI.mousePos.y)
        UI.drawCtx.lineTo(x,y)
        UI.drawCtx.stroke()
    }

    UI.mousePos.x = x
    UI.mousePos.y = y
}

function onTouchEnd(event){
    event.preventDefault()
    UI.mouseDown = false 
}

function onTouchLeave(event){
     event.preventDefault()
    UI.mouseDown = false 
}


function clear(event){
    UI.drawCtx.fillStyle = "rgb(0,0,0)"
    UI.previewCtx.fillStyle = "rgb(0,0,0)"

    UI.drawCtx.rect(0,0,canvas.width, canvas.height)
    UI.previewCtx.rect(0,0,UI.previewCanvas.width, UI.previewCanvas.height)
    
    UI.drawCtx.fill()
    UI.previewCtx.fill()

    UI.predictSpan.innerText = ""
}

function predict(){
   
     let scaled_image = scaleImage(UI.drawCanvas)
     
     //convert pixels to arr of normalized values
     let pixels = scaled_image.getContext('2d').getImageData(0,0,28,28).data
     let pixel_arr = []
     for (let i = 0; i < pixels.length; i+=4){
         pixel_arr.push(pixels[i]/255)
     }

    let prediction = nn.predict([pixel_arr])[0]

    UI.previewCtx.drawImage(scaled_image, 0,0)
    UI.predictSpan.innerText = decode(prediction)

}


/**
 * decoded one-hot-encoded output and returns digit predicted
 */
function decode(arr){
    let index = 0
    arr.forEach((p,i) => {
        if (arr[i] > arr[index]){
            index = i
        }
    })
    return index
}

/**
 * Takes raw drawing and scales and centers digit in same way mnist datset was preprocessed
 */
function scaleImage(canvas){
    
     let pixels = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data
     
     let top = canvas.height
     let bottom = 0;
     let left = canvas.width
     let right = 0;
    
     let center_x = 0
     let center_y = 0
     let num_white = 0

     //compute bounding box and center of mass
     for (let row = 0; row < canvas.height; row++){
         for (let col = 0; col < canvas.width; col++){
             let offset = (row * canvas.width + col) * 4
             if (pixels[offset] != 0){
                center_x += col
                center_y += row
                num_white++

                if (row < top){
                    top = row
                }
                if (row > bottom){
                    bottom = row
                }
                if (col < left){
                    left = col
                }
                if (col > right){
                    right = col
                }
             }
         }
     }

     //average x and y cooridinates
     center_x = center_x/num_white
     center_y = center_y/num_white

     //scale image such that it fits in 20 x 20 box while preversing aspect ratio
     let scaled_width
     let scaled_height

     let aspect_ratio = (right - left)/(bottom - top)

     if (aspect_ratio > 1){
         scaled_width = 20
         scaled_height = 20/aspect_ratio
     } else {
         scaled_height = 20
         scaled_width = 20 * aspect_ratio
     }

    //calculate center off mass in terms of scaled pixels
    center_x = (center_x - left) / (right - left) * scaled_width
    center_y = (center_y - top) / (bottom - top) * scaled_height

    //draw centered and scaled image
    let scaled_canvas = document.createElement("canvas")
    scaled_canvas.width = 28
    scaled_canvas.height = 28
    scaled_canvas.getContext('2d').imageSmoothingQuality = 'high'
    scaled_canvas.getContext('2d').drawImage(canvas,left,top, (right - left), (bottom - top), 14 - center_x, 14 - center_y, scaled_width, scaled_height)

    return scaled_canvas
}




//Training Stuff
///////////////////////////////////////////////////////////////////////////////////

let params = {
    input_size: 784,
    hidden_size: 64,
    hidden_activation:'sigmoid',
    output_size: 10,
    output_activation: 'sigmoid'
}

let learn_rate = 1
let epochs = 15
let loss_func = "cross-entropy"
let batch_size = 32


function train(){
    console.log("loading data")
    Papa.parse("./mnist/mnist_train.csv", {
        download:true,
        complete: (result) => {
             
              let training_data = preProcess(result.data)
              
              console.log("training...")
              nn = new Axon.FeedForwardNN(params)
             
              let t0 = performance.now()
              nn.train(training_data.x, training_data.y, learn_rate, epochs, loss_func, batch_size)
              let t1 = performance.now()

              console.log("time:", Math.round((t1 - t0)/1000))
             
              test()
              downloadObjectAsJson(nn.export(),"model")
              
              console.log("done training")
        }
    })
}

function test(){
    console.log("loading data")
    Papa.parse("./mnist/mnist_test.csv", {
        download:true,
        complete: (result) => {
              console.log("testing...")
              
              let testing_data = preProcess(result.data)
              let num_correct = 0

              for (let i in testing_data.x){
                  let prediction = nn.predict([testing_data.x[i]])[0]
                  if (decode(prediction) == decode(testing_data.y[i])){
                      num_correct += 1
                  }
              }
              console.log("Accuracy", num_correct/testing_data.x.length * 100)
        }
    })
}

/**
 * Prepare data for training by nomralizing pixel values and one-hot encoding labels
 */
function preProcess(data){
    data.pop() //last row is null
    
    let pixels = []
    let labels = []

    data.forEach((element) => {
        labels.push(element[0])
        pixels.push(element.slice(1))
    })

    //noramlize pixel values to [0, 1]
    pixels = pixels.map((row) => row.map((pixel) => (pixel/255)))

    //one hot encode labels
    labels = labels.map((label) => {
        let arr = Array(10).fill(0)
        arr[parseInt(label)] = 1
        return arr
    })

    return {x:pixels, y:labels}
}

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }