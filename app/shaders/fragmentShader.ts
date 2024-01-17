// const fragmentShader = `

// uniform vec3 u_test;

// varying vec2 vUv;

// vec3 colorA = vec3(0.912,0.191,0.652);
// vec3 colorB = vec3(1.000,0.777,0.052);

// void main() {
//   // "Normalizing" with an arbitrary value
//   // We'll see a cleaner technique later :)   
//   vec2 normalizedPixel = gl_FragCoord.xy/600.0;
//   vec3 color = mix(colorA, colorB, normalizedPixel.x);

//   gl_FragColor = vec4(u_test, 1.0);
// }

// `


const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_test;

void main() {
  // Normalized coordinates
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // Add time for animation (slower speed)
  float time = u_time * 0.05;

  // Create a pulsating effect (calmer pulsation)
  float pulse = 0.5 + 0.5 * sin(time);

  // Create diagonal looping lines with slower animation
  float diagonalLines = mod(uv.x + uv.y + time * 2.0, 0.1) < 0.09 ? 1.0 : 0.0;

  // Mix the line color with a calm background color
  vec3 backgroundColor = vec3(0.8, 0.9, 1.0);
  // vec3 color = mix(backgroundColor, u_test, diagonalLines) * pulse;
  vec3 color = mix(backgroundColor, u_test, diagonalLines);

  // Apply a radial gradient
  // float distanceToCenter = distance(uv, vec2(0.5));
  // color *= smoothstep(0.4, 0.45, 0.5 - distanceToCenter);

  // Make the lines transparent and fade in
  // float alpha = smoothstep(0.0, 0.5, pulse);
  float alpha = 1.0;
  
  // Output the final color with transparency
  gl_FragColor = vec4(color, alpha);
}



` 

export default fragmentShader
