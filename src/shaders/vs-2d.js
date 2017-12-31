export default `
  attribute vec2 a_position;
  uniform vec2 u_resolution;
  uniform vec2 u_rotation;
  uniform vec2 u_scale;
  uniform vec2 u_translation;
  void main() {
    vec2 scaledPosition = a_position * u_scale;
    vec2 rotatedPosition = vec2(
      scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
      scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
    );
    vec2 translatedPosition = rotatedPosition + u_translation;
    vec2 zeroToOne = translatedPosition / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    vec2 flippedYAxis = clipSpace * vec2(1, -1);
    gl_Position = vec4(flippedYAxis, 0, 1);
  }
`;
