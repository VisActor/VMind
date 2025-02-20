import * as React from 'react';
import { Home } from './pages/Home';
import { LayoutWrap } from './Layout';
import './index.scss';

export default function App() {
  return (
    <LayoutWrap>
      <Home />
    </LayoutWrap>
  );
}
