import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { InteractionState } from "@/hooks/use-interaction"

interface FluidBackgroundProps {
  interaction: React.MutableRefObject<InteractionState>
}

/**
 * A full-screen background plane that simulates a deep oceanic fluid.
 * Mouse movements create ripples and distortions in the gradient.
 */
export function FluidBackground({ interaction }: FluidBackgroundProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uMouseVelocity: { value: 0 },
      uClickPulse: { value: 0 },
    }),
    [],
  )

  useFrame((state) => {
    if (!materialRef.current) return
    const time = state.clock.elapsedTime
    const inter = interaction.current

    materialRef.current.uniforms.uTime.value = time
    // Normalized mouse (-1 to 1)
    materialRef.current.uniforms.uMouse.value.set(inter.mouseX, inter.mouseY)
    materialRef.current.uniforms.uMouseVelocity.value = inter.mouseVelocity
    materialRef.current.uniforms.uClickPulse.value = inter.clickPulse
  })

  // GLSL Shader for the deep ocean ripples
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      // Full screen quad
      gl_Position = vec4(position.xy, 0.99, 1.0); // push back in Z
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uMouseVelocity;
    uniform float uClickPulse;
    varying vec2 vUv;

    // Classic Perlin 2D Noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      
      // Fix aspect ratio distortion roughly (assuming standard widescreen)
      vec2 st = uv * vec2(1.8, 1.0);
      
      // Map mouse to UV space (mouse is -1 to 1)
      vec2 mouseUv = uMouse * vec2(0.5, -0.5) + 0.5;
      mouseUv.x *= 1.8; // match aspect ratio fix

      // Distance to mouse
      float distToMouse = distance(st, mouseUv);
      
      // Mouse ripple effect
      float mouseRipple = smoothstep(0.4, 0.0, distToMouse) * uMouseVelocity;
      
      // Click ripple effect
      float clickRipple = sin(distToMouse * 20.0 - uTime * 15.0) * uClickPulse * smoothstep(1.0, 0.0, distToMouse);

      // Base organic noise flow
      vec2 noiseUv = st * 1.5 + vec2(uTime * 0.05, uTime * 0.08);
      float noise = snoise(noiseUv + mouseRipple + clickRipple);

      // Theme colors — deep navy base with gold + blue accents
      vec3 baseColor = vec3(0.043, 0.055, 0.071);
      vec3 goldTint = vec3(0.84, 0.71, 0.43);
      vec3 blueTint = vec3(0.42, 0.55, 1.0);

      float intensity = noise * 0.5 + 0.5;
      intensity += mouseRipple * 0.25 + clickRipple * 0.2;

      vec3 color = mix(baseColor, goldTint, intensity * 0.12);
      color = mix(color, blueTint, smoothstep(0.55, 1.0, intensity) * 0.06);

      gl_FragColor = vec4(color, 1.0);
    }
  `

  return (
    <mesh>
      {/* 2x2 plane covers screen since we set Z to 0.99 in vertex shader */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
        depthTest={false} // Make sure it renders strictly as background
      />
    </mesh>
  )
}
