var yOffset;
var xOffset;
var canvas;
const SCALE = 20; 
var v1, v2 = null;
const V1_COLOR = "red";
const V2_COLOR = "blue";
const V3_COLOR = "purple";
const V4_COLOR = "green";

function main(){

    //retreive canvas element
    canvas = document.getElementById('test');
    if(!canvas){
        console.log("Failed to retrieve the <canvas> element ");
        return false;
    }

    yOffset = canvas.height/2;
    xOffset = canvas.width/2;

    var ctx = canvas.getContext('2d');   
    ctx.translate(xOffset,yOffset);
    //ctx.rotate(Math.PI/(-2));
    ctx.transform(1,0,0,-1, 0, 0);

}

//draws 3d vector
function drawVector(context, scale , v, color){
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(v.elements[0] * scale, v.elements[1] * scale);
    context.stroke();
}

function clearWindow(context){
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function handleDrawEvent(){
    var ctx = canvas.getContext('2d');   

    // Use the identity matrix while clearing the canvas
    clearWindow(ctx);

    let v1_x = parseFloat(document.getElementById("v1_x").value);
    let v1_y = parseFloat(document.getElementById("v1_y").value);

    let v2_x = parseFloat(document.getElementById("v2_x").value);
    let v2_y = parseFloat(document.getElementById("v2_y").value);

    if (!(isNaN(v1_x) && isNaN(v2_y))){
        v1 = new Vector3([v1_x, v1_y, 0]);
        drawVector(ctx, SCALE, v1, V1_COLOR);
        console.log("V1 is printed");
    }else{
        return;
    }

    if (!(isNaN(v2_x) && isNaN(v2_y))){
        v2 = new Vector3([v2_x, v2_y, 0]);
        drawVector(ctx, SCALE, v2, V2_COLOR);
        console.log("V2 is printed");
    }else{
        return;
    }
}

function handleDrawOperationEvent(){
    console.log('test');
    var context = canvas.getContext('2d');
    let v3 = new Vector3(v1.elements);
    let v4 = new Vector3(v2.elements);

    const potential_case = document.getElementById("draw_operation").value;
    const potential_scalar = Number(document.getElementById("scalar").value);

    if (potential_case == "add"){
        v3.add(v2);
        drawVector(context, SCALE, v3, V3_COLOR);
    }
    else if (potential_case == "subtract"){
        v3.sub(v2);
        drawVector(context, SCALE, v3, V3_COLOR);
    }
    else if (potential_case == "multiply"){
        if(potential_scalar){
            v3.mul(potential_scalar);
            drawVector(context, SCALE, v3, V3_COLOR);
            v4.mul(potential_scalar);
            drawVector(context, SCALE, v4, V4_COLOR);
        }
    }
    else if (potential_case == "divide"){
        if(potential_scalar){
            v3.div(potential_scalar);
            drawVector(context, SCALE, v3, V3_COLOR);
            v4.div(potential_scalar);
            drawVector(context, SCALE, v4, V4_COLOR);
        }
    }
    else if (potential_case == "normalize"){
        v3.normalize();
        v4.normalize();
        drawVector(context, SCALE, v3, V3_COLOR);
        drawVector(context, SCALE, v4, V4_COLOR);
    }
    else if (potential_case == "magnitude"){
        console.log("V1 magnitude: ", v3.magnitude());
        console.log("V2 magnitude: ", v4.magnitude());
    }
    else if (potential_case == "area"){
        let xVec = Vector3.cross(v3, v4);
        console.log(xVec.elements);
        let num = xVec.elements[2] / 2;
        console.log("Area of the triangle: ", num);
    }
    else if (potential_case == "angle between"){
        console.log(angleBetween(v1, v2));
    }
}

function angleBetween(v1, v2){
    let dot = Vector3.dot(v1, v2);
    let v1_mag = v1.magnitude();
    let v2_mag = v2.magnitude();
    return dot / (v1_mag*v2_mag);
}
