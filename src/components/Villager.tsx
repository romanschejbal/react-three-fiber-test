import * as React from 'react';
import * as THREE from 'three';
import { a, useSpring } from '@react-spring/three';
import { CanvasContext, useFrame } from 'react-three-fiber';
import { config } from 'react-spring';
import * as PF from 'pathfinding';
import selectionState from '../state/selection';
import { useRecoilState } from 'recoil';

const pathfinder = new PF.AStarFinder({
  diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle,
  heuristic: PF.Heuristic.euclidean,
});

console.log(pathfinder);

interface IProps {
  name: string;
}

export default function Villager(props: IProps) {
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
  const [selection, setSelection] = useRecoilState(selectionState);

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
      if (!selection.units.includes(props.name)) {
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
      if (!selection.units.includes(props.name)) {
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
  }, [selection]);

  const selected = selection.units.includes(props.name);

  return (
    <a.group
      ref={meshRef}
      position={props.position}
      rotation-x={rotateX}
      rotation-z={rotateZ}
      onClick={(e) => {
        e.stopPropagation();
        setSelection((selection) =>
          selected
            ? {
                ...selection,
                units: selection.units.filter((id) => id !== props.name),
              }
            : { ...selection, units: [...selection.units, props.name] }
        );
      }}
    >
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxBufferGeometry attach="geometry" args={[1, 1.5, 1]} />
        <a.meshStandardMaterial color={selected ? 'blue' : 'white'} />
      </mesh>
    </a.group>
  );
}
