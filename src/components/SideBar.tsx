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
        <Menu.Item key="/chapter_4">
          <NavLink to="/chapter_4">
            <Icon type="upload" />
            <span>骨骼动画</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/chapter_5">
          <NavLink to="/chapter_5">
            <Icon type="upload" />
            <span>圆</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/chapter_6">
          <NavLink to="/chapter_6">
            <Icon type="upload" />
            <span>BufferGeometry</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/chapter_7">
          <NavLink to="/chapter_7">
            <Icon type="upload" />
            <span>Object</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/chapter_8">
          <NavLink to="/chapter_8">
            <Icon type="upload" />
            <span>窗帘</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/chapter_9">
          <NavLink to="/chapter_9">
            <Icon type="upload" />
            <span>ArrayCamera</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/chapter_10">
          <NavLink to="/chapter_10">
            <Icon type="upload" />
            <span>points</span>
          </NavLink>
        </Menu.Item>
      </Menu>
    );
  }
}

