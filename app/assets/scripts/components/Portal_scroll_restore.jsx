import { List, WindowScroller, InfiniteLoader } from "react-virtualized";
import React from 'react';
import Util from '../utils/util'

class Portal_scroll_restore extends React.Component {
  constructor() {
    super();
    this.loadMore = this.loadMore.bind(this)
    this.renderRow = this.renderRow.bind(this);
    this.state={
      list : Array(100).fill().map((idx) => {
        return {
          id: idx, 
        }
      }),
      hasMore : true,
      tab : 'online'
    }
    console.log('constructor!!')
    this.scrollY_online = 0
    this.scrollY_goods = 0
  }

  renderRow({ index, key, style, isScrolling }) {
    return (
      <div key={key} style={style} 
      onClick={()=>{
        this.props.history.push({
          pathname: `./online`,
          state: {
          omidx: index,
          },
          search: `?omidx=${index}`,
        });
        // console.log(document.documentElement.scrollTop)
        document.cookie=`scrollToIndex=${index}`
      }}
      >
      <div style={{
        backgroundColor : index%2 === 0 ? '#ff7979' : '#7ed6df',
        width : '100%',
        height : '100%'
      }}>
        {index}

      </div>
      </div>
    );
  }

  renderRow2({ index, key, style, isScrolling }) {
    return (
      <div key={key} style={style} 
      onClick={()=>{
        this.props.history.push({
          pathname: `./online`,
          state: {
          omidx: index,
          },
          search: `?omidx=${index}`,
        });
        // console.log(document.documentElement.scrollTop)
        document.cookie=`scrollToIndex=${index}`
      }}
      >
      <div style={{
        backgroundColor : index%2 === 0 ? '#ff4999' : '#3ed6df',
        width : '100%',
        height : '100%'
      }}>
        {index}

      </div>
      </div>
    );
  }
   rowHeight =(index)=>{
     if(index.index % 2 ===0){
      return 120
     }else{
      return 240
     }
   }
  // listRef = React.createRef();

  loadMore () {
    // simulate a request
    setTimeout(() => {this.actuallyLoadMore()}, 500)
    // we need to return a promise
    return new Promise((resolve, reject) => {
       this.promiseResolve = resolve;
    })
 }
 
 actuallyLoadMore(){
    // fake new data
    this.setState({
        list : this.state.list.concat(Array(100).fill().map((idx) => {
            return {
              id: idx, 
            }
          }))
    })
    // resolve the promise after data where fetched
    this.promiseResolve();
 }
 TabChange =(str)=>{
    if(str === 'online' && this.state.tab !== 'online'){
        this.setState({
            tab : 'online'
        })
    }
    if(str === 'goods' && this.state.tab !== 'goods'){
        this.setState({
            tab : 'goods'
        })
    }
 }
  //상단 탭바 관련 코드
  renderPanel() {
    const TabBarStyle = {
      display: 'flex',
      width: '100%',
      height: `${45 * Util.getNativeR()}px`,
      backgroundColor: 'white',
      position: 'fixed',
      top: '0',
      zIndex: '1000000000000000',
      borderBottom: 'thin solid #f1f1f1',
    };

    const TabBarContentStyle_left = {
      display: 'inline',
      width: '25%',
      height: `${42 * Util.getNativeR()}px`,
      color: 'black',
      borderBottom: `${3 * Util.getNativeR()}px solid white`,
      fontSize: `${16 * Util.getNativeR()}px`,
      fontFamliy: 'Noto Sans KR',
      textAlign: 'center',
      lineHeight: `${42 * Util.getNativeR()}px`,
      marginRight: '0px',
      marginLeft : '25%',
      '&:hover': {
        color: '#f0af24',
        borderBottom: `${3 * Util.getNativeR()}px solid #f0af24`,
      },
    };
    const TabBarContentStyle_right = {
      display: 'inline',
      width: '25%',
      height: `${42 * Util.getNativeR()}px`,
      color: 'black',
      borderBottom: `${3 * Util.getNativeR()}px solid white`,
      fontSize: `${16 * Util.getNativeR()}px`,
      fontFamliy: 'Noto Sans KR',
      textAlign: 'center',
      lineHeight: `${42 * Util.getNativeR()}px`,
      marginLeft: '0px',

      '&:hover': {
        color: '#f0af24',
        borderBottom: `${3 * Util.getNativeR()}px solid #f0af24`,
      },
    };
    const TabBarContent_Click_Style_left = {
      display: 'inline',
      width: '25%',
      height: `${42 * Util.getNativeR()}px`,
      borderBottom: `${3 * Util.getNativeR()}px solid #f0af24`,
      color: '#f0af24',
      fontSize: `${16 * Util.getNativeR()}px`,
      fontFamliy: 'Noto Sans KR',
      textAlign: 'center',
      lineHeight: `${42 * Util.getNativeR()}px`,
      marginRight: '0px',
      marginLeft : '25%',

    };
    const TabBarContent_Click_Style_right = {
      display: 'inline',
      width: '25%',
      height: `${42 * Util.getNativeR()}px`,
      borderBottom: `${3 * Util.getNativeR()}px solid #f0af24`,
      color: '#f0af24',
      fontSize: `${16 * Util.getNativeR()}px`,
      fontFamliy: 'Noto Sans KR',
      textAlign: 'center',
      lineHeight: `${42 * Util.getNativeR()}px`,
      marginLeft: '0px',
    };

    return (
      //상단 탭바 관련 코드
      <div style={TabBarStyle}>
        <div
          onClick={() => this.TabChange('online')}
          style={
            this.state.tab === 'online'
              ? TabBarContent_Click_Style_left
              : TabBarContentStyle_left
          }
        >
          브랜드몰
        </div>
        <div
          onClick={() => this.TabChange('goods')}
          style={
            this.state.tab === 'goods'
              ? TabBarContent_Click_Style_right
              : TabBarContentStyle_right
          }
        >
          적립상품
        </div>
      </div>
    );
  }
  componentDidUpdate(prevProps, prevState){
      if(prevState.tab !== this.state.tab){
          console.log('변경')
          if(this.state.tab==='online'){
              this.scrollY_goods = window.scrollY
              window.scrollTo(0,this.scrollY_online)
          }else{
            this.scrollY_online = window.scrollY
            window.scrollTo(0,this.scrollY_goods)

          }
      }
  }
  render() {
    console.log('render!!')
    if(this.state.tab === 'online'){
        return (
            
            <div className="App">
              <div className="list">
              {this.renderPanel()}
              <InfiniteLoader
                    // isRowLoaded={this.isRowLoaded}
                    // loadMoreRows={this.loadMoreRows}
                    isRowLoaded={({ index}) => !!this.state.list[index]}
                    loadMoreRows={this.loadMore}
                    // rowCount={1000000}
                    // rowCount={this.state.threeList.length}
      
                    rowCount={this.state.hasMore ? this.state.list.length + 1 : this.state.list.length}
                    threshold={5}
                    >
                  {({ onRowsRendered, registerChild }) => {
                    return(
                    <WindowScroller>
                  {({ height, isScrolling, onChildScroll, scrollTop }) =>
                      <List
                      //estimatedRowSize={240}
                        ref={(ref) => {this.listRef = ref;}}                
                        autoHeight
                        height={height}
                        isScrolling={isScrolling}
                        onScroll={onChildScroll}
                        rowHeight={this.rowHeight}
                        // rowHeight={200}
                        rowRenderer={this.renderRow}
                        onRowsRendered={onRowsRendered}
                        rowCount={this.state.list.length}
                        scrollTop={scrollTop}
                        width={window.innerWidth}
                        scrollToIndex={this.state.list.length}
                        overscanRowCount={1}
                      />
                  }
                  </WindowScroller>
                  )}}
              </InfiniteLoader>
              </div>
            </div>
          );
    }else{
        return (
        
            <div className="App">
              <div className="list">
              {this.renderPanel()}
              <InfiniteLoader
                    // isRowLoaded={this.isRowLoaded}
                    // loadMoreRows={this.loadMoreRows}
                    isRowLoaded={({ index}) => !!this.state.list[index]}
                    loadMoreRows={this.loadMore}
                    // rowCount={1000000}
                    // rowCount={this.state.threeList.length}
      
                    rowCount={this.state.hasMore ? this.state.list.length + 1 : this.state.list.length}
                    threshold={5}
                    >
                  {({ onRowsRendered, registerChild }) => {
                    return(
                    <WindowScroller>
                  {({ height, isScrolling, onChildScroll, scrollTop }) =>
                      <List
                      //estimatedRowSize={240}
                        ref={(ref) => {this.listRef = ref;}}                
                        autoHeight
                        height={height}
                        isScrolling={isScrolling}
                        onScroll={onChildScroll}
                        rowHeight={this.rowHeight}
                        // rowHeight={200}
                        rowRenderer={this.renderRow2}
                        onRowsRendered={onRowsRendered}
                        rowCount={this.state.list.length}
                        scrollTop={scrollTop}
                        width={window.innerWidth}
                        scrollToIndex={this.state.list.length}
                        overscanRowCount={1}
                      />
                  }
                  </WindowScroller>
                  )}}
              </InfiniteLoader>
              </div>
            </div>
          );
    }


  }
}

export default Portal_scroll_restore;