import * as React from 'react';
import Tile from '../components/Tile';
import Villager from '../components/Villager';

import { softShadows } from '@react-three/drei';
import { useFrame } from 'react-three-fiber';
import { useSpring, config } from 'react-spring';

import gridState from '../state/grid';

import { useRecoilValue } from 'recoil';

softShadows({});

export interface IProps {}

export default function GameScene(props: IProps) {
  const grid = useRecoilValue(gridState);

  const [{ cameraMoveX, cameraMoveZ, cameraY }, setSpring] = useSpring(() => ({
    cameraMoveX: 0,
    cameraMoveZ: 0,
    cameraY: 0,
    config: config.gentle,
  }));
  const controlledPlayerRef = React.useRef('roman');
  React.useEffect(() => {
    function handleSpacebar(e: KeyboardEvent) {
      if (e.code === 'Space') {
        controlledPlayerRef.current =
          controlledPlayerRef.current === 'roman' ? 'dawe' : 'roman';
      }
    }
    function handleScroll(e: WheelEvent) {
      e.preventDefault();
      setSpring({ cameraY: (cameraY.getValue() as number) + e.deltaY / 10 });
    }
    function handleMouseMove(e: MouseEvent) {
      const threshold = window.innerWidth / 5;
      const border = threshold / 3;
      if (e.clientX < threshold && e.clientX > border) {
        setSpring({ cameraMoveX: -1 });
      } else if (
        e.clientX > window.innerWidth - threshold &&
        e.clientX < window.innerWidth - border
      ) {
        setSpring({ cameraMoveX: 1 });
      } else {
        setSpring({ cameraMoveX: 0 });
      }

      if (e.clientY < threshold && e.clientY > border) {
        setSpring({ cameraMoveZ: -1 });
      } else if (
        e.clientY > window.innerHeight - threshold &&
        e.clientY < window.innerHeight - border
      ) {
        setSpring({ cameraMoveZ: 1 });
      } else {
        setSpring({ cameraMoveZ: 0 });
      }
    }
    window.addEventListener('wheel', handleScroll);
    // window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keypress', handleSpacebar);
    return () => {
      window.removeEventListener('keypress', handleSpacebar);
      // window.addEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  useFrame((ctx, deltaTime) => {
    if (!cameraMoveX) return;
    ctx.camera.position.x += (cameraMoveX.getValue() as number) / 5;
    ctx.camera.position.z += (cameraMoveZ.getValue() as number) / 5;
    ctx.camera.position.y = cameraY.getValue() as number;
    ctx.camera.lookAt(0, 0, 0);
  });

  const villagers = [
    { position: [-1, 0, 1], name: 'roman' },
    { position: [3, 0, -1], name: 'dawe' },
  ];
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 20, 10]} castShadow />
      <fog attach="fog" args={[0x111827, 10, 100]} />
      {[...new Array(grid.height)].map((_, z, arrZ) =>
        [...new Array(grid.width)].map((_, x, arrX) => (
          <Tile
            key={`${x}x${z}`}
            position={[-arrX.length / 2 + x, 0, -arrZ.length / 2 + z]}
            // coords={[x, z]}
            index={z * grid.width + x}
          />
        ))
      )}
      {villagers.map(({ name, position }) => (
        <Villager key={name} {...{ name, position, controlledPlayerRef }} />
      ))}
    </>
  );
}
