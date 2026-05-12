#version 300 es
precision highp float;

out vec4 outColor;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uCameraPos;
uniform vec2  uMouseTilt;
uniform int   uQualityLow;

vec3 hash33(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7,  74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6))
  );
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(dot(hash33(i + vec3(0,0,0)), f - vec3(0,0,0)),
          dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
      mix(dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0)),
          dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x),
      u.y),
    mix(
      mix(dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1)),
          dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
      mix(dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1)),
          dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x),
      u.y),
    u.z);
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

float radialFalloff(vec3 p) {
  float yBand  = smoothstep(3.0,  0.0, abs(p.y));
  float xzRing = smoothstep(15.0, 0.0, length(p.xz));
  return yBand * xzRing;
}

float densityAt(vec3 p) {
  vec3 q = p * 0.6 + uTime * vec3(0.02, 0.01, 0.03);
  float n = fbm(q);
  n = max(n + 0.15, 0.0);
  return n * radialFalloff(p) * 1.6;
}

float hg(float cosTheta, float g) {
  float g2 = g * g;
  float denom = pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5);
  return (1.0 - g2) / (denom * 12.5663706);
}

void main() {
  vec2 ndc = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
  ndc.x *= uResolution.x / uResolution.y;

  vec3 ro    = uCameraPos;
  vec3 fwd   = normalize(vec3(uMouseTilt.x, uMouseTilt.y, 1.0));
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up    = cross(fwd, right);
  vec3 rd    = normalize(fwd + ndc.x * right * 0.9 + ndc.y * up * 0.9);

  vec3 lightDir = normalize(vec3(0.4, 0.6, -0.5));

  int   steps    = (uQualityLow == 1) ? 24 : 48;
  float stepSize = (uQualityLow == 1) ? 0.9 : 0.6;
  float t        = 0.0;
  vec3  accum    = vec3(0.0);
  float trans    = 1.0;

  for (int i = 0; i < 64; i++) {
    if (i >= steps) break;
    vec3 p = ro + rd * t;
    float d = densityAt(p);

    if (d > 0.001) {
      vec3 neb = mix(
        vec3(0.039, 0.227, 0.208),
        vec3(0.435, 0.820, 0.780),
        clamp(d, 0.0, 1.0)
      );

      if (uQualityLow == 0) {
        float phase = hg(dot(rd, lightDir), 0.7);
        neb += vec3(0.976, 0.451, 0.086) * phase * 0.45;
      }

      float absorb = d * stepSize;
      accum += trans * neb * absorb;
      trans *= exp(-absorb);
      if (trans < 0.01) break;
    }

    t += stepSize;
  }

  float horizon = smoothstep(-0.2, 0.4, rd.y);
  vec3  bg      = mix(
    vec3(0.024, 0.024, 0.055),
    vec3(0.047, 0.086, 0.078),
    horizon
  );
  accum += trans * bg;

  accum = pow(accum, vec3(1.0 / 2.2));

  outColor = vec4(accum, 1.0);
}
