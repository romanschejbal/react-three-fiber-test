import * as React from 'react';
import Head from 'next/head';
import { Canvas, CanvasContext, MeshProps, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { a, useSpring, config } from '@react-spring/three';
import { softShadows } from '@react-three/drei/softShadows.cjs';

softShadows();

const Tile = (
  props: MeshProps & {
    position: THREE.Vector3Tuple;
  }
) => {
  const [hover, setHover] = React.useState(-20);

  React.useEffect(() => {
    setTimeout(() => setHover(0), Math.random() * 500);
  }, []);

  const { hovered } = useSpring({
    hovered: hover,
    config: config.stiff,
  });

  return (
    <a.mesh
      {...props}
      position-y={hovered.to(
        [0, 1],
        [props.position[1], props.position[1] + 0.5]
      )}
      scale={[1, 1, 1]}
      scale-y={hovered.to([0, 1], [1, 0.1], 'clamp')}
      scale-x={hovered.to([-20, 0, 0.9, 1], [0, 1, 1, 1])}
      scale-z={hovered.to([-20, 0, 0.9, 1], [0, 1, 1, 1])}
      onPointerOver={(e) => (e.stopPropagation(), setHover(1))}
      onPointerOut={(e) => (e.stopPropagation(), setHover(0))}
      onClick={(e) => (e.stopPropagation(), setHover(() => 2))}
      receiveShadow
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <a.meshStandardMaterial
        color={hovered.to([0, 1], ['orange', 'white'], 'clamp')}
        opacity={hovered.to([0, 1, 2], [1, 1, 0.5])}
      />
    </a.mesh>
  );
};

function Villager(props: any) {
  const meshRef = React.useRef<THREE.Mesh>();
  const direction = React.useRef(new THREE.Vector3());
  const speed = 7;
  const tilt = 10; // less is more
  const jumpingHeight = 0.15;
  const jumpingFrequence = 0.02;
  const [{ rotateX, rotateZ }, setSpring] = useSpring(() => ({
    rotateX: 0,
    rotateZ: 0,
    config: config.wobbly,
  }));

  useFrame((ctx: CanvasContext, deltaTime: number) => {
    // if (ctx.camera.position.y < 20) ctx.camera.position.y += deltaTime;
    // ctx.camera.lookAt(
    //   meshRef.current?.position.multiply(new THREE.Vector3(1, 0, 1))
    // );

    if (meshRef.current && direction.current.length() > 0) {
      setSpring({
        rotateX: (Math.PI / tilt) * -direction.current.z,
        rotateZ: (Math.PI / tilt) * direction.current.x,
      });
      meshRef.current.position.add(
        direction.current
          .clone()
          .normalize()
          .multiplyScalar(deltaTime * speed)
      );
      // jumping
      meshRef.current.position.y =
        Math.abs(Math.sin(new Date().getTime() * jumpingFrequence)) *
        jumpingHeight;
    } else if (meshRef.current) {
      meshRef.current.position.y = 0;
      setSpring({ rotateX: 0, rotateZ: 0 });
    }
  });

  React.useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (props.controlledPlayerRef.current !== props.name) {
        return;
      }

      switch (e.code) {
        case 'ArrowLeft':
          return (direction.current.x = -1);
        case 'ArrowRight':
          return (direction.current.x = 1);
        case 'ArrowUp':
          return (direction.current.z = -1);
        case 'ArrowDown':
          return (direction.current.z = 1);
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (props.controlledPlayerRef.current !== props.name) {
        return;
      }

      switch (e.code) {
        case 'ArrowLeft':
          return (direction.current.x = 0);
        case 'ArrowRight':
          return (direction.current.x = 0);
        case 'ArrowUp':
          return (direction.current.z = 0);
        case 'ArrowDown':
          return (direction.current.z = 0);
      }
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  return (
    <a.group
      ref={meshRef}
      position={props.position}
      rotation-x={rotateX}
      rotation-z={rotateZ}
    >
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxBufferGeometry attach="geometry" args={[1, 1.5, 1]} />
        <a.meshStandardMaterial color={'white'} />
      </mesh>
    </a.group>
  );
}

const Ground = (props: any) => {
  return (
    <>
      {[...new Array(props.size)].map((_, z, arrZ) =>
        [...new Array(props.size)].map((_, x, arrX) => (
          <Tile
            key={`${x}x${z}`}
            position={[-arrX.length / 2 + x, 0, -arrZ.length / 2 + z]}
          />
        ))
      )}
    </>
  );
};

export default function Home() {
  const [isDarkMode, setDarkMode] = React.useState(true);
  const controlledPlayerRef = React.useRef('roman');

  React.useEffect(() => {
    function handleSpacebar(e: KeyboardEvent) {
      if (e.code === 'Space') {
        controlledPlayerRef.current =
          controlledPlayerRef.current === 'roman' ? 'dawe' : 'roman';
      }
    }
    window.addEventListener('keypress', handleSpacebar);
    return () => window.removeEventListener('keypress', handleSpacebar);
  }, []);

  return (
    <>
      <Head>
        <title>Southgard</title>
      </Head>
      <main className={`${isDarkMode ? 'dark' : ''} h-full`}>
        <div className="h-full bg-gradient-to-br dark:text-white dark:from-gray-800 dark:to-gray-900">
          <h1
            className="text-xl font-bold absolute z-50 select-none p-4"
            onClick={() => setDarkMode((d) => !d)}
          >
            Southgard
          </h1>

          <Canvas camera={{ position: [0, 2, 10], fov: 60 }} shadowMap>
            <ambientLight />
            <pointLight position={[10, 20, 10]} castShadow />
            {/* <fog attach="fog" args={[0xffffff00, 5, 15]} /> */}
            <Ground size={30} />
            <Villager
              position={[-1, 0, 1]}
              name="roman"
              controlledPlayerRef={controlledPlayerRef}
            />
            <Villager
              position={[3, 0, -1]}
              name="dawe"
              controlledPlayerRef={controlledPlayerRef}
            />
          </Canvas>
        </div>
      </main>
    </>
  );
}
