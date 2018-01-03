import createShader from './core/create-shader';
import createProgram from './core/create-program';
import vs2d from './shaders/vs-2d';
import fsVariable from './shaders/fs-variable';
import * as m3 from './core/m3';

/**
 * Creates a rectangle
 * @param {WebGLRenderingContext} gl
 * @param {number} width
 * @param {number} height
 */
function setRectangle(gl, width, height) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      //top left
      0,
      0,
      //top right
      width,
      0,
      //bottom right
      width,
      height,
      //bottom left
      0,
      height
    ]),
    gl.STATIC_DRAW
  );
}

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

function main() {
  /** @type {HTMLCanvasElement} */
  const canvasNode = document.querySelector(`.gameCanvas`);
  const gl = canvasNode.getContext(`webgl`);
  if (!gl) {
    throw new Error(`Failed to retrieve WebGL rendering context`);
  }
  //shader program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs2d);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsVariable);
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);
  const positionAttr = gl.getAttribLocation(program, `a_position`);
  const colorUni = gl.getUniformLocation(program, `u_color`);
  const transformUni = gl.getUniformLocation(program, `u_transform`);
  gl.enableVertexAttribArray(positionAttr);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);
  //render
  gl.clearColor(0, 0, 0, 1); //reset to black
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (let i = 0; i < 100; i++) {
    // setTriangle(gl, 25);
    setRectangle(gl, 20, 50);
    gl.uniform4f(colorUni, Math.random(), Math.random(), Math.random(), 1);
    const translateX = Math.random() * (gl.canvas.width - 20);
    const translateY = Math.random() * (gl.canvas.height - 50);
    const angleInRadians = Math.random() * 2 * Math.PI;
    const scaleX = Math.random() * 1.5 + 0.5;
    const scaleY = Math.random() * 1.5 + 0.5;
    const projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height);
    const translationMatrix = m3.translation(translateX, translateY);
    const rotationMatrix = m3.rotation(angleInRadians);
    const scalingMatrix = m3.scaling(scaleX, scaleY);
    const tranformationMatrix = [projectionMatrix, translationMatrix, rotationMatrix, scalingMatrix].reduce(m3.multiply);
    gl.uniformMatrix3fv(transformUni, false, tranformationMatrix);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}

main();
