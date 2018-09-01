/**
 * Creates WebGL shader
 * @param {WebGLRenderingContext} gl
 * @param {number} shaderType
 * @param {string} shaderSource
 * @returns {WebGLShader}
 */
export default function(gl, shaderType, shaderSource) {
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)
  const wasSuccessfulCompile = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!wasSuccessfulCompile) {
    const shaderCompileError = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Failed to compile shader: ${shaderCompileError}`)
  }
  return shader
}
