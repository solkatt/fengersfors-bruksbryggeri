const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_test;


float rand(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.y / u_resolution.x;
    
    vec3 color = vec3(0.0);
    
    const int numParticles = 100;
    float particleSize = 0.5;
    
    for(int i = 0; i < numParticles; i++){
        vec2 pos = vec2(
            uv.x + sin(uv.y*20.0 + float(i)*0.1) * 0.1,
            uv.y + cos(uv.x*20.0 + float(i)*0.1) + rand(vec2(float(i),0.0)) * 0.02
        );
        
        float dist = length(pos);
        color += vec3(
            sin(dist*10.0 + u_time),
            cos(dist*15.0 + u_time),
            tan(dist*20.0 + u_time)
        );
    }
    
    gl_FragColor = vec4(color, 1.0);
}
` 



export default fragmentShader
