import React, { Suspense } from 'react';
import { Layout } from 'antd';
import SideBar from './components/SideBar';
import RouterMap from "./Router/index";
const { Sider, Content } = Layout;
const App: React.FC = () => {
  return (
    <Layout>
      <Sider collapsible>
        <SideBar />
      </Sider>
      <Layout>
        <Content
          style={{
            padding: 24,
            background: '#fff',
            height: '100vh',
          }}
        >
          <React.Fragment>
            <Suspense fallback={<div className="SuspenseCss"><div className="loadingCss"><div className="loadingCss2">loading</div></div></div>}>
              <RouterMap />
            </Suspense>
          </React.Fragment>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
