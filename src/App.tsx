import {
  OrbitControls,
  shaderMaterial,
  useTexture,
  Sky,
} from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import {
  BufferAttribute,
  BufferGeometry,
  RepeatWrapping,
  ShaderMaterial,
  Uniform,
  Vector3,
} from "three";
import { useEffect, useMemo, useRef } from "react";
import generateBlade from "./utils/generateBlade";
const GrassMaterial = shaderMaterial(
  {
    uGrassTexture: null,
    uCloudTexture: null,
    uTime: 0,
  },
  vertexShader,
  fragmentShader
);
extend({ GrassMaterial });
const Grass = () => {
  const bladeCount = 400000;
  const planeSize = 30;

  const materialRef = useRef<ShaderMaterial>(null);
  //加载纹理

  const grass = useTexture("/textures/grass/grass.jpg");
  const cloud = useTexture("/textures/grass/cloud.jpg");
  cloud.wrapS = cloud.wrapT = RepeatWrapping;

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uGrassTexture = new Uniform(grass);
      materialRef.current.uniforms.uCloudTexture = new Uniform(cloud);
    }
  }, []);
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (materialRef.current)
      materialRef.current.uniforms.uTime.value = elapsedTime;
  });
  // 生成草地几何体
  const geometry = useMemo(() => {
    const positionsArray: number[] = [];
    const uvArray: number[] = [];
    const colorArray: number[] = [];
    const indiceArray: number[] = [];

    for (let i = 0; i < bladeCount; i++) {
      const radius = planeSize / 2;
      const r = radius * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);

      const blade = generateBlade(
        new Vector3(x, 0, z),
        i * 5,
        [x / planeSize + 0.5, z / planeSize + 0.5],
        0.8
      );
      blade.verts.forEach((vert) => {
        positionsArray.push(...vert.pos);
        uvArray.push(...vert.uv);
        colorArray.push(...vert.color);
      });
      blade.indices.forEach((indice) => indiceArray.push(indice));
    }

    const geom = new BufferGeometry();
    geom.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(positionsArray), 3)
    );
    geom.setAttribute("uv", new BufferAttribute(new Float32Array(uvArray), 2));
    geom.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(colorArray), 3)
    );
    geom.setIndex(indiceArray);
    geom.computeVertexNormals();

    return geom;
  }, [bladeCount, planeSize]);
  return (
    <>
      <mesh geometry={geometry}>
        <grassMaterial ref={materialRef}></grassMaterial>
      </mesh>
    </>
  );
};
const GrassScene = () => {
  return (
    <>
      <Canvas
        gl={{ antialias: true }}
        camera={{
          position: [-7, 3, 7],
        }}
      >
        <Sky />
        <Grass />
        <OrbitControls makeDefault />
      </Canvas>
    </>
  );
};

function App() {
  return (
    <>
      <GrassScene />
    </>
  );
}

export default App;
