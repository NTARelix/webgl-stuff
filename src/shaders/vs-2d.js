export default `
  attribute vec2 a_position;
  attribute vec2 a_textureCoordinates;
  uniform mat3 u_transform;
  varying vec2 v_textureCoordinates;
  void main() {
    gl_Position = vec4((u_transform * vec3(a_position, 1)).xy, 0, 1);
    v_textureCoordinates = a_textureCoordinates;
  }
`;
