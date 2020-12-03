import * as React from 'react';
import { MeshProps } from 'react-three-fiber';
import { a, useSpring, config } from '@react-spring/three';
import { Html } from '@react-three/drei';
import gridState from '../state/grid';
import tilesStateFamily from '../state/tiles';
import { selector, selectorFamily, useRecoilState } from 'recoil';

const tileNodeState = selectorFamily({
  key: 'tile&node',
  get: (index) => ({ get }) => {
    const grid = get(gridState);
    const y = Math.floor(Number(index) / grid.width);
    const x = Number(index) % grid.width;
    const node = grid.getNodeAt(x, y);
    const tile = get(tilesStateFamily(index));
    return { node, tile };
  },
  set: (index) => ({ get, set }, { walkable }) => {
    const grid = get(gridState);
    const y = Math.floor(Number(index) / grid.width);
    const x = Number(index) % grid.width;
    console.log('setWalkableAt', x, y, walkable);
    grid.setWalkableAt(x, y, false);
    console.log(grid.getNodeAt(x, y));
    set(tilesStateFamily(index), { walkable });
  },
});

export default function Tile(
  props: MeshProps & {
    position: THREE.Vector3Tuple;
    // coords: readonly [number, number];
    index: number;
  }
) {
  const [hover, setHover] = React.useState(-20);
  const [showMenu, setShowMenu] = React.useState(false);
  const [state, setState] = useRecoilState(tileNodeState(props.index));

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
      onPointerOut={(e) => (
        e.stopPropagation(), setHover(0), setShowMenu(false)
      )}
      onClick={(e) => (
        e.stopPropagation(),
        setHover(() => 2),
        setState(
          ({ node }) => (console.log(node), { walkable: !node.walkable })
        )
      )}
      receiveShadow
    >
      <boxBufferGeometry
        attach="geometry"
        args={[1, state.node.walkable ? 1 : 3, 1]}
      />
      <a.meshStandardMaterial
        color={hovered.to([0, 1], ['orange', 'white'], 'clamp')}
        opacity={hovered.to([0, 1, 2], [1, 1, 0.5])}
      />
      {showMenu ? (
        <Html>
          <div className="bg-white p-3 text-black mt-3">
            <ul className="">
              <li>Did not expect me down here, did you?</li>
            </ul>
          </div>
        </Html>
      ) : null}
    </a.mesh>
  );
}
