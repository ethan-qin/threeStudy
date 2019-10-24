import * as React from 'react';
import { Menu, Icon } from 'antd';
import { NavLink } from "react-router-dom";

export interface ISideBarProps {
}

export interface ISideBarState {
}

export default class SideBar extends React.Component<ISideBarProps, ISideBarState> {
  constructor(props: ISideBarProps) {
    super(props);

    this.state = {
    }
  }
  public render() {
    return (
      <Menu theme="dark" defaultSelectedKeys={['chapter_1']}>
        <Menu.Item key="/chapter_1">
          <NavLink to="/chapter_1">
            <Icon type="user" />
            <span>内置模型</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/chapter_2">
          <NavLink to="/chapter_2">
            <Icon type="video-camera" />
            <span>贴图自定义</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/chapter_3">
          <NavLink to="/chapter_3">
            <Icon type="upload" />
            <span>导入外部模型</span>
          </NavLink>
        </Menu.Item>
      </Menu>
    );
  }
}

