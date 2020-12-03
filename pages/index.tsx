import * as React from 'react';
import Head from 'next/head';
import { Canvas } from 'react-three-fiber';
import dynamic from 'next/dynamic';

const GameScene = dynamic(() => import('../src/scenes/GameScene'), {
  loading: () => null,
  ssr: false,
});

export default function Home() {
  const [isDarkMode, setDarkMode] = React.useState(true);

  return (
    <>
      <Head>
        <title>Southgard</title>
      </Head>
      <main className={`${isDarkMode ? 'dark' : ''} h-full`}>
        <div className="h-full bg-gradient-to-br dark:text-white dark:from-gray-900 dark:to-gray-900">
          <h1
            className="text-xl font-bold absolute z-50 select-none p-4"
            onClick={() => setDarkMode((d) => !d)}
          >
            Southgard
          </h1>

          <Canvas camera={{ position: [0, 2, 10], fov: 60 }} shadowMap>
            <GameScene />
          </Canvas>
        </div>
      </main>
    </>
  );
}
