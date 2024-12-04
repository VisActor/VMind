import React from 'react';
import { Layout, Menu } from '@arco-design/web-react';
import { CollapseCSS, PLAYGROUND_MENU_INFO, PLAYGROUND_PAGES } from './constants';
const Sider = Layout.Sider;
const Content = Layout.Content;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const LOCAL_STORAGE_MENU_KEY = 'VMind_playground_menu_key';
export const Home: React.FC = props => {
  const [selectedPage, setSelectedPage] = React.useState(`${PLAYGROUND_PAGES.CHART_DIALOG_QA}_1`);
  const [collapsed, setCollapsed] = React.useState(false);
  const component = React.useMemo(() => {
    const [menu, index] = selectedPage.split('_');
    return PLAYGROUND_MENU_INFO[menu]?.subItems?.[Number(index)]?.component;
  }, [selectedPage]);

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
          defaultOpenKeys={[PLAYGROUND_PAGES.DATA_EXTRACTION]}
          defaultSelectedKeys={[`${PLAYGROUND_PAGES.DATA_EXTRACTION}_0`]}
          selectedKeys={[selectedPage]}
          onClickMenuItem={(key: any) => {
            setSelectedPage(key);
            localStorage.setItem(LOCAL_STORAGE_MENU_KEY, key);
          }}
        >
          {Object.keys(PLAYGROUND_MENU_INFO).map(pageName => {
            const item = PLAYGROUND_MENU_INFO[pageName];
            return (
              <SubMenu
                key={pageName}
                title={
                  <>
                    {item.icon}
                    {item.menuItem}
                  </>
                }
              >
                {item.subItems.map(v => {
                  return <MenuItem key={`${pageName}_${v.key}`}>{v.name}</MenuItem>;
                })}
              </SubMenu>
            );
          })}
        </Menu>
      </Sider>
      <Layout style={{ background: '#fff' }}>{component}</Layout>
    </Layout>
  );
};
