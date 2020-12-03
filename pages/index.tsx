import * as React from 'react';
import Head from 'next/head';
import { Canvas } from 'react-three-fiber';
import dynamic from 'next/dynamic';
import {
  useRecoilBridgeAcrossReactRoots_UNSTABLE,
  useRecoilValue,
} from 'recoil';
import selectionState from '../src/state/selection';
import gridState from '../src/state/grid';

const GameScene = dynamic(() => import('../src/scenes/Game'), {
  loading: () => null,
  ssr: false,
});

function Debug() {
  const selection = useRecoilValue(selectionState);
  const grid = useRecoilValue(gridState);
  return (
    <pre className="absolute right-1 top-1 z-50 bg-gray-800 text-white m-1 p-2 rounded">
      {JSON.stringify(selection, undefined, 2)}
      <br />
      {/* {JSON.stringify(grid.nodes, undefined, 2)} */}
    </pre>
  );
}

export default function Home() {
  const [isDarkMode, setDarkMode] = React.useState(true);
  const ContextBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  return (
    <>
      <Head>
        <title>Southgard</title>
      </Head>
      <main className={`${isDarkMode ? 'dark' : ''} h-full`}>
        <div className="h-full bg-gradient-to-br dark:text-white dark:from-gray-900 dark:to-gray-900">
          <h1
            className="m-2 font-bold absolute z-50 select-none rounded bg-white text-black p-2 py-1 uppercase"
            onClick={() => setDarkMode((d) => !d)}
          >
            Southgard
          </h1>

          <Debug />

          <Canvas camera={{ position: [0, 2, 10], fov: 60 }} shadowMap>
            <ContextBridge>
              <GameScene />
            </ContextBridge>
          </Canvas>
        </div>
      </main>
    </>
  );
}
