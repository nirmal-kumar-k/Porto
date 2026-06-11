import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface TennisBallMaterialProps {
  emissiveBoost?: number
}

/**
 * Procedural tennis-ball surface — two interlocking seams painted directly
 * onto the sphere so they are always visible (no z-fighting with tubes).
 */
export function TennisBallMaterial({ emissiveBoost = 0.6 }: TennisBallMaterialProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEmissiveBoost: { value: emissiveBoost },
    }),
    [emissiveBoost],
  )

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <shaderMaterial
      ref={matRef}
      uniforms={uniforms}
      vertexShader={`
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `}
      fragmentShader={`
        uniform float uTime;
        uniform float uEmissiveBoost;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        float seamDistance(vec3 n) {
          float d = 10.0;
          for (int i = 0; i < 56; i++) {
            float t = float(i) / 56.0 * 6.2831853;
            vec3 p = vec3(
              0.7 * cos(t) + 0.3 * cos(3.0 * t),
              0.7 * sin(t) - 0.3 * sin(3.0 * t),
              0.99 * sin(2.0 * t)
            );
            p = normalize(p);
            d = min(d, distance(n, p));
            vec3 p2 = vec3(p.z, p.y, -p.x);
            d = min(d, distance(n, p2));
          }
          return d;
        }

        void main() {
          vec3 n = normalize(vNormal);
          float d = seamDistance(n);

          float seamCore = smoothstep(0.09, 0.018, d);
          float seamGlow = smoothstep(0.16, 0.04, d);

          vec3 body = vec3(0.047, 0.059, 0.082);
          vec3 bodyHighlight = vec3(0.08, 0.09, 0.12);
          vec3 gold = vec3(0.84, 0.71, 0.43);
          vec3 blue = vec3(0.42, 0.55, 1.0);

          float fresnel = pow(1.0 - max(dot(n, normalize(vViewPosition)), 0.0), 2.2);
          vec3 col = mix(body, bodyHighlight, fresnel * 0.35);

          float pulse = 0.85 + 0.15 * sin(uTime * 1.4);
          col = mix(col, gold, seamCore * 0.95);
          col += gold * seamGlow * 0.55 * pulse;
          col += blue * seamCore * 0.25 * uEmissiveBoost;

          float glow = seamGlow * (0.4 + uEmissiveBoost * 0.6) * pulse;
          gl_FragColor = vec4(col + gold * glow, 1.0);
        }
      `}
    />
  )
}
