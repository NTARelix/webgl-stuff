import createShader from './core/create-shader';
import createProgram from './core/create-program';
import Container from './core/container';
import * as m3 from './core/m3';
import vs2d from './shaders/vs-2d';
import fsVariable from './shaders/fs-variable';

export default class Renderer {
  /**
  * @param {HTMLCanvasElement} canvasNode
  */
  constructor(canvasNode) {
    this.gl = canvasNode.getContext(`webgl`);
    if (!this.gl) {
      throw new Error(`Failed to retrieve WebGL rendering context`);
    }
    const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vs2d);
    const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fsVariable);
    this.program = createProgram(this.gl, vertexShader, fragmentShader);
    this.positionAttr = this.gl.getAttribLocation(this.program, `a_position`);
    this.textureCoordinateAttr = this.gl.getAttribLocation(this.program, `a_textureCoordinates`);
    this.transformationUni = this.gl.getUniformLocation(this.program, `u_transform`);
  }

  /**
  * @param {Image} image
  * @returns {WebGLTexture}
  */
  _createTexture(image) {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.vertexAttribPointer(this.textureCoordinateAttr, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    return texture;
  }

  /**
   * @param {WebGLBuffer} buffer
   * @param {number} left
   * @param {number} right
   * @param {number} top
   * @param {number} bottom
   */
  _setTextureCoordinates(buffer, left, top, right, bottom) {
    this.gl.enableVertexAttribArray(this.textureCoordinateAttr);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      //top left
      left,
      top,
      //top right
      right,
      top,
      //bottom right
      right,
      bottom,
      //bottom left
      left,
      bottom
    ]), this.gl.STATIC_DRAW);
  }

  /**
  * @param {WebGLBuffer} buffer
  * @param {number} width
  * @param {number} height
  */
  _setRectangle(buffer, width, height) {
    this.gl.enableVertexAttribArray(this.positionAttr);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(this.positionAttr, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
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
    ]), this.gl.STATIC_DRAW);
  }

  /**
  * @param {number<Array>} matrix
  */
  _setTransformation(matrix) {
    this.gl.uniformMatrix3fv(this.transformationUni, false, matrix);
  }

  /**
   * @param {Container} container
   * @param {number<Array>} parentTransformationMatrix
   */
  _renderContainer(container, parentTransformationMatrix) {
    const translationMatrix = m3.translation(container.x, container.y);
    const scalingMatrix = m3.scaling(container.scaleX, container.scaleY);
    const rotationMatrix = m3.rotation(container.rotation);
    const localTransformationMatrix = [
      parentTransformationMatrix,
      translationMatrix,
      scalingMatrix,
      rotationMatrix
    ].reduce(m3.multiply);
    if (container.image) {
      const rectBuffer = this.gl.createBuffer();
      this._setRectangle(rectBuffer, container.image.naturalWidth, container.image.naturalHeight);
      const texCoordBuffer = this.gl.createBuffer();
      this._setTextureCoordinates(texCoordBuffer, 0, 0, 1, 1);
      this._createTexture(container.image); //probably a memory leak
      this._setTransformation(localTransformationMatrix);
      this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
    }
    container.children.forEach(child => this._renderContainer(child, localTransformationMatrix));
  }

  /**
  * @param {Container} rootContainer
  */
  render(rootContainer) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clearColor(0, 0, 0, 1); //reset to black
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    const projectionMatrix = m3.projection(this.gl.canvas.width, this.gl.canvas.height);
    this._renderContainer(rootContainer, projectionMatrix);
  }
}
