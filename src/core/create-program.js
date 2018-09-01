/**
 * Creates a fragment program from a vertex shader and fragment shader
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 * @returns {WebGLProgram}
 */
export default function(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const wasLinkSuccessful = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!wasLinkSuccessful) {
    const programLinkError = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(`Failed to link shader program: ${programLinkError}`)
  }
  return program
}
