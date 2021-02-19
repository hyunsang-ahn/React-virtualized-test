import React from 'react';
import {Link, Route, BrowserRouter as Router} from 'react-router-dom';

import Portal from './Portal_scroll_restore';
// 탭 state에 따른 render 모델
// import Portal from './Portal_scroll_restore_displayOnOff';
//탭 state 값에 따른 display on off 모델
import Util from '../utils/util.js'
class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state ={
      is_interaction : true
    }

  }

 
  componentDidMount() {

  }

  render() {
    console.log(Util.getOnlinemall())
    //20.07.16 new version
    if (this.state.is_interaction) {
      return (
        <Router>
          {/* 초기페이지(포탈) */}
          <Route exact={true} path="/" component={Portal} />

        </Router>
      );
    } else {
      return <div />;
    }
  }
}

export default App;
