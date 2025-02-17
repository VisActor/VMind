import React from 'react';
import { Layout, Menu } from '@arco-design/web-react';
import { CollapseCSS, PLAYGROUND_MENU_INFO, PLAYGROUND_PAGES } from './constants';
const Sider = Layout.Sider;
const Content = Layout.Content;
const MenuItem = Menu.Item;

const LOCAL_STORAGE_MENU_KEY = 'VMind_playground_menu_key';
export const Home: React.FC = props => {
  const [selectedPage, setSelectedPage] = React.useState(PLAYGROUND_PAGES.CHART_GENERATION);
  const [collapsed, setCollapsed] = React.useState(true);
  return (
    <Layout style={CollapseCSS}>
      <Sider
        defaultCollapsed={true}
        collapsed={collapsed}
        onCollapse={(v, type) => {
          type === 'clickTrigger' && setCollapsed(v);
        }}
        breakpoint="xl"
        collapsible
      >
        <Menu
          mode={'pop'}
          selectedKeys={[selectedPage]}
          onClickMenuItem={(key: any) => {
            setSelectedPage(key);
            localStorage.setItem(LOCAL_STORAGE_MENU_KEY, key);
          }}
        >
          {Object.keys(PLAYGROUND_MENU_INFO).map(pageName => {
            const item = PLAYGROUND_MENU_INFO[pageName];
            return (
              <MenuItem key={pageName}>
                {item.icon}
                {item.menuItem}
              </MenuItem>
            );
          })}
        </Menu>
      </Sider>
      <Layout>{PLAYGROUND_MENU_INFO[selectedPage].component}</Layout>
    </Layout>
  );
};
