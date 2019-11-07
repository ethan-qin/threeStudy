import * as React from 'react';
import { Route, Switch } from "react-router-dom";
export interface IRouterMapProps {
}

export interface IRouterMapState {
}

export default class RouterMap extends React.Component<IRouterMapProps, IRouterMapState> {
  constructor(props: IRouterMapProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return <Switch>
      <Route path="/chapter_1" exact component={React.lazy(() => import('./../Pages/chapter_1'))} />
      <Route path="/chapter_2" exact component={React.lazy(() => import('./../Pages/chapter_2'))} />
      <Route path="/chapter_3" exact component={React.lazy(() => import('./../Pages/chapter_3'))} />
      <Route path="/chapter_4" exact component={React.lazy(() => import('./../Pages/chapter_4'))} />
      <Route path="/chapter_5" exact component={React.lazy(() => import('./../Pages/chapter_5'))} />
      <Route path="/chapter_6" exact component={React.lazy(() => import('./../Pages/chapter_6'))} />
      <Route path="/chapter_7" exact component={React.lazy(() => import('./../Pages/chapter_7'))} />
      <Route path="/chapter_8" exact component={React.lazy(() => import('./../Pages/chapter_8'))} />
    </Switch>
  }
}


