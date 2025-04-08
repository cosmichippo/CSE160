class Triangle{
    constructor(x, y, color, scale){
      this.vertices = new Float32Array(Triangle.createTriangleCoords(x, y, scale));
      this.color = color;
    }
    
    drawTriangle(){
      var {canvas, gl} = setupWebGL();
      var {a_Position, u_FragColor} = connectVariablesToGLSL(gl, VSHADER_SOURCE, FSHADER_SOURCE);
      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log('Failed toi create the buffer object');
        return -1; 
      }
      console.log(this.vertices);
      renderShape(gl, a_Position, u_FragColor, vertexBuffer, this.vertices, this.color, 3, gl.TRIANGLES);
    }
    
    static createTriangleCoords(x, y, scale = 1){
      return [ (0.5/scale) + x, (Math.sqrt(3)/scale) + y, 0 + x,0 + y, (1/scale) + x, 0+ y]
    }
  
}
  