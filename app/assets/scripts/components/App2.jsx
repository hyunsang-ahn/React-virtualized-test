import React from 'react';
import {Link, Route, BrowserRouter as Router} from 'react-router-dom';
/*상품 상세 페이지*/
import Portal from './Portal';
/*온라인몰 상세 페이지*/
import Onlinemall_detail from './Onlinemall_detail';

class App2 extends React.PureComponent {
  render() {
      return (
        <Router>
          {/* 초기페이지(포탈) */}
          <Route exact={true} path="/" component={Portal} />
          {/* 온라인몰 상세 페이지 */}
          <Route path="/online" component={Onlinemall_detail} />
        </Router>
      );

  }
}

export default App2;
