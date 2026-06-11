import * as THREE from "three"

/**
 * Generates the classic tennis-ball seam as a single continuous 3D curve.
 * Parametric equations produce the interlocking "double horseshoe" pattern.
 * We use this as an abstract nod to tennis geometry — elegant, not literal.
 *
 * Reference parametric form:
 *   x = a*cos(t) + b*cos(3t)
 *   y = a*sin(t) - b*sin(3t)
 *   z = c*sin(2t)
 */
export function createSeamCurve(radius: number, segments = 256): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = []
  const a = 0.7
  const b = 0.3
  const c = 0.99

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const x = a * Math.cos(t) + b * Math.cos(3 * t)
    const y = a * Math.sin(t) - b * Math.sin(3 * t)
    const z = c * Math.sin(2 * t)
    // Normalize onto the sphere surface for a clean seam that hugs the form.
    const v = new THREE.Vector3(x, y, z).normalize().multiplyScalar(radius)
    points.push(v)
  }

  const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.5)
  return curve
}
