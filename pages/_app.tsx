import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
