attribute vec3 color;

varying vec2 vUv;
varying vec2 vCloudUV;

varying vec3 vColor;
uniform float uTime;

void main() {
    vec3 newPostiton = position;

    float waveSize = 12.0;
    float tipDistance = 0.3;
    float centerDistance = 0.1;

    if(color.x > 0.5) {
        newPostiton.x += sin(uTime + uv.x * waveSize) * tipDistance;
    } else if(color.x > 0.0) {
        newPostiton.x += sin(uTime + uv.x * waveSize) * centerDistance;
    }
    vec2 cloudUv = uv;
    cloudUv.x += uTime * 0.05;
    cloudUv.y += uTime * 0.01;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPostiton, 1.0);

    vUv = uv;
    vCloudUV = cloudUv;
    vColor = color;

}