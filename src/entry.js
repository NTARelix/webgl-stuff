import createShader from './core/create-shader';
import createProgram from './core/create-program';
import vs2d from './shaders/vs-2d';
import fsVariable from './shaders/fs-variable';

/**
 * Creates a right triangle
 * @param {WebGLRenderingContext} gl
 * @param {number} size
 */
function setTriangle(gl, size) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      //top left
      0,
      0,
      //bottom right
      size,
      size,
      //bottom left
      0,
      size
    ]),
    gl.STATIC_DRAW
  );
}

function rand(max) {
  return Math.random() * max;
}

/**
 * Draws scene to gl context
 * @param {WebGLRenderingContext} gl
 */
function drawScene(gl) {
  //shader program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs2d);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsVariable);
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  const positionAttr = gl.getAttribLocation(program, `a_position`);
  const colorUni = gl.getUniformLocation(program, `u_color`);
  const resolutionUni = gl.getUniformLocation(program, `u_resolution`);
  const rotationUni = gl.getUniformLocation(program, `u_rotation`);
  const scaleUni = gl.getUniformLocation(program, `u_scale`);
  const translationUni = gl.getUniformLocation(program, `u_translation`);
  gl.enableVertexAttribArray(positionAttr);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(resolutionUni, gl.canvas.width, gl.canvas.height);
  //render
  gl.clearColor(0, 0, 0, 1); //reset to black
  gl.clear(gl.COLOR_BUFFER_BIT);
  const triangleSize = 25;
  for (let i = 0; i < 100; i++) {
    setTriangle(gl, triangleSize);
    gl.uniform4f(colorUni, rand(1), rand(1), rand(1), 1);
    gl.uniform2f(translationUni, rand(gl.canvas.width - triangleSize), rand(gl.canvas.height - triangleSize))
    const angleDeg = Math.random() * 360;
    const angleRad = angleDeg * Math.PI / 180;
    const rotX = Math.cos(angleRad);
    const rotY = Math.sin(angleRad);
    const scaleX = Math.random() * 3 + 0.5;
    const scaleY = Math.random() * 3 + 0.5;
    gl.uniform2f(rotationUni, rotX, rotY);
    gl.uniform2f(scaleUni, scaleX, scaleY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

function main() {
  const canvasNode = document.querySelector(`.gameCanvas`);
  const gl = canvasNode.getContext(`webgl`);
  if (!gl) {
    throw new Error(`Failed to retrieve WebGL rendering context`);
  }
  drawScene(gl);
}

main();
