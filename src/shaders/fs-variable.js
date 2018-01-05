export default `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_textureCoordinates;
  void main() {
    gl_FragColor = texture2D(u_image, v_textureCoordinates);
  }
`;