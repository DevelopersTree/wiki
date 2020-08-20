import React from 'react';

import 'antd/dist/antd.css';
import '../styles/vars.css';
import '../styles/global.css';
import '../styles/main.css';
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
