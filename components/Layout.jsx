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
        <title>Wikipedia Helper Tools</title>
        <meta charset="UTF-8" />
        <meta name="description" content="With this tool will give you suggestions for missing wikipedia articles" />
        <meta name="keywords" content="wiki, wikipedia, devs.krd, devs-krd, devstree" />
        <meta name="author" content="Developers Tree" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout style={{ minHeight: '700px' }}>
        {/* <Header>Header</Header> */}
        <Layout.Content style={{ padding: 30 }}>{children}</Layout.Content>
        {/* <Footer>Footer</Footer> */}
      </Layout>
    </>
  );
}
