export function SceneLights() {
  return <>
    <ambientLight intensity={1.4} color="#fff4df" />
    <directionalLight position={[-4, 6, 5]} intensity={2.3} color="#fff5e5" />
    <directionalLight position={[4, 2, -2]} intensity={1.1} color="#ede8df" />
  </>;
}
