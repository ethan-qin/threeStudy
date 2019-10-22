import * as React from 'react';

export interface IChapter1Props {
}

export interface IChapter1State {
}

export default class Chapter2 extends React.Component<IChapter1Props, IChapter1State> {
  constructor(props: IChapter1Props) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div>
        <h1>第二张</h1>
      </div>
    );
  }
}
