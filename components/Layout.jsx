/* eslint-disable react/no-danger */
import React from 'react';
import { Layout } from 'antd';
import Head from 'next/head';

export default function CustomLayout(props) {
  const { children } = props;
  return (
    <>
      <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-77029418-6" />

        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'UA-77029418-6');
          `,
        }}
        />
      </Head>
      <Layout style={{ minHeight: '700px' }}>
        {/* <Header>Header</Header> */}
        <Layout.Content style={{ padding: 30 }}>{children}</Layout.Content>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </>
  );
}
