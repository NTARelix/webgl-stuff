import createShader from './core/create-shader';
import createProgram from './core/create-program';
import vs2d from './shaders/vs-2d';
import fsVariable from './shaders/fs-variable';
import * as m3 from './core/m3';
import imageUrl from './test-images/firefox.png';

async function loadImage(imageUrl) {
  const imageObj = new Image();
  imageObj.src = imageUrl;
  await new Promise((resolve, reject) => {
    imageObj.onload = resolve;
    imageObj.onerror = reject;
  });
  return imageObj;
}

async function main() {
  const image = await loadImage(imageUrl);
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
  const positionAttr = gl.getAttribLocation(program, `a_position`);
  const textureCoordinateAttr = gl.getAttribLocation(program, `a_textureCoordinates`);
  const transformationUni = gl.getUniformLocation(program, `u_transform`);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      //top left
      0,
      0,
      //top right
      image.naturalWidth,
      0,
      //bottom right
      image.naturalWidth,
      image.naturalHeight,
      //bottom left
      0,
      image.naturalHeight,
      //top left
      0,
      0,
      //top right
      image.naturalWidth,
      0,
      //bottom right
      image.naturalWidth,
      image.naturalHeight,
      //bottom left
      0,
      image.naturalHeight
    ]),
    gl.STATIC_DRAW
  );
  const textureCoordinateBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      //top left
      0,
      0,
      //top right
      1,
      0,
      //bottom right
      1,
      1,
      //bottom left
      0,
      1
    ]),
    gl.STATIC_DRAW
  );
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  //render
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1); //reset to black
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.enableVertexAttribArray(textureCoordinateAttr);
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
  gl.vertexAttribPointer(textureCoordinateAttr, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttr);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);
  for (let i = 0; i < 5; i++) {
    const projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height);
    const transX = Math.random() * (gl.canvas.width - 2 * image.naturalWidth) + image.naturalWidth;
    const transY = Math.random() * (gl.canvas.height - 2 * image.naturalHeight) + image.naturalHeight;
    const translationMatrix = m3.translation(transX, transY);
    const scale = Math.random() * 1.8 + 0.2
    const scalingMatrix = m3.scaling(scale, scale);
    const rotationMatrix = m3.rotation(Math.random() * 2 * Math.PI);
    const transformationMatrix = [
      projectionMatrix,
      translationMatrix,
      scalingMatrix,
      rotationMatrix
    ].reduce(m3.multiply);
    gl.uniformMatrix3fv(transformationUni, false, transformationMatrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}

main();
