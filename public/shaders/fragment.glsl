#extension GL_OES_standard_derivatives : enable

varying highp vec2 uv;

/*precision mediump float;

struct PointLight {
    vec3 position;
    vec3 ambientColor;
    vec3 diffuseColor;
    float lightConstant;
    float lightLinear;
    float lightQuadratic;
};

varying highp vec3 vFragPos;

vec3 calculatePointLight(PointLight light, vec3 normal, vec3 fragmentPos) {
    vec3 lightDirection = normalize(light.position - fragmentPos);
    float difference = max(dot(normal, lightDirection), 0.0);

    // attenuation //
    float distance = length(light.position - fragmentPos);
    float attenuation = 1.0 / (light.lightConstant + light.lightLinear * distance + light.lightQuadratic * (distance * distance));

    vec3 diffuse = light.diffuseColor * difference * attenuation;
    vec3 ambient = light.ambientColor * attenuation;

    return ambient + diffuse;
}

float edgeFactor() {
    vec3 d = fwidth(vbc);
    vec3 f = step(d * 0.5, vbc);
    return min(min(f.x, f.y), f.z);
} */

void main(void) {
    // vec3 norm = normalize(vNormal);

    // PointLight purpleLight = PointLight(vec3(-5.0, -5.0, 5.0), vec3(0.65, 1, 0), vec3(0.65, 1, 0), 1.0, 0.05, 0.005);
    // PointLight blueLight = PointLight(vec3(5.0, 5.0, 5.0), vec3(0.2, 0.2, 0.2), vec3(0, 0.14, 0.37), 1.0, 0.05, 0.005);

    // vec3 lightCalc1 = calculatePointLight(purpleLight, norm, vFragPos);
    // vec3 lightCalc2 = calculatePointLight(blueLight, norm, vFragPos);

    //vec3 color = vec3(lightCalc1 + lightCalc2);
    //if (edgeFactor() == 0.0) {
        //gl_FragColor = vec4(color, 1.0);
    //} else {
        //discard;
    //}
    if (mod(abs(uv.x), 0.1) <= 0.005 || mod(abs(uv.y), 0.1) <= 0.005) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1);
        return;
    }
    discard;
    //gl_FragColor = vec4(uv.x, uv.y, 0, 1.0);
}
