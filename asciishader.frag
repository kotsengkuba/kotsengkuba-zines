precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform sampler2D charSet2D;

uniform vec2 offset;
uniform float time;
uniform float tiles;



void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  
  uv *= tiles;
  
  uv = floor(uv);
  
  uv /= tiles;
  
  vec4 tex = texture2D(tex0, uv);

  
  gl_FragColor = tex;
}