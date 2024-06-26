import * as React from 'react';
import { PageHeader, Button, Layout } from '@arco-design/web-react';

export function LayoutWrap(props: any) {
  return (
    <Layout style={{ height: '100%' }}>
      <PageHeader
        style={{ background: 'var(--color-bg-2)', borderBottom: '1px solid #eee', padding: '10px 0' }}
        title="VMind Playground"
        subTitle="make visualization easier"
      />
      {props.children}
    </Layout>
  );
}
