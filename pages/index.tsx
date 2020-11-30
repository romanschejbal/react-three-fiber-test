import * as React from 'react';
import Head from 'next/head';
import { Canvas } from 'react-three-fiber';
import { softShadows } from '@react-three/drei/softShadows.cjs';
import Villager from '../src/components/Villager';
import Tile from '../src/components/Tile';

softShadows();

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

  const villagers = [
    { position: [-1, 0, 1], name: 'roman' },
    { position: [3, 0, -1], name: 'dawe' },
  ];

  const groundSize = 30;

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
            {[...new Array(groundSize)].map((_, z, arrZ) =>
              [...new Array(groundSize)].map((_, x, arrX) => (
                <Tile
                  key={`${x}x${z}`}
                  position={[-arrX.length / 2 + x, 0, -arrZ.length / 2 + z]}
                />
              ))
            )}
            {villagers.map(({ name, position }) => (
              <Villager
                key={name}
                {...{ name, position, controlledPlayerRef }}
              />
            ))}
          </Canvas>
        </div>
      </main>
    </>
  );
}
