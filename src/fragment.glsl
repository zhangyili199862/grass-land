uniform sampler2D uGrassTexture;
uniform sampler2D uCloudTexture;
varying vec2 vUv;
varying vec2 vCloudUV;

void main() {
    float contrast = 1.5;
    float brightness = 0.1;
    vec3 color = vec3(0.0);

    vec3 grassColor = texture2D(uGrassTexture, vUv).rgb;
    vec3 cloudColor = texture2D(uCloudTexture, vCloudUV).rgb;

    color = grassColor * contrast;
    color += brightness;
    float mixStrength = 1.0 - cloudColor.r;
    mixStrength *= cloudColor.g;
    if(cloudColor.x == 0.0 && cloudColor.y == 0.0 && cloudColor.z == 0.0) {
        mixStrength = 0.0;
    }

    color = mix(color, vec3(0.0), mixStrength);

    gl_FragColor = vec4(color, 1.0);
}