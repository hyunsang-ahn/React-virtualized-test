import { List, WindowScroller, InfiniteLoader } from "react-virtualized";
import React from 'react';
import Util from '../utils/util'
const rowCount = 100;
const listHeight = 640;
const rowWidth = 360;

class Portal_PureWindow extends React.Component {
  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
    this.state={
      list : Array(rowCount).fill().map((val, idx) => {
        return {
          id: idx, 
          name: 'John Doe',
          image: 'http://via.placeholder.com/40',
        }
      })
    }
    console.log('constructor!!')
    this.scrollY = 0
    this.scrollToIndex = Util.getCookieValue('scrollToIndex') ? (Util.getCookieValue('scrollToIndex') * 1):(-1) 


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
   rowHeight =(index)=>{
     if(index.index % 2 ===0){
      return 120
     }else{
      return 240
     }
   }
  // listRef = React.createRef();

  onRowsRendered = ({ startIndex, stopIndex }) => {
    console.log('startIndex........', startIndex)
    console.log('stopIndex........', stopIndex)

  };
  // componentDidMount(){
  //   console.log('CDM')
  //   var scrollY = Util.getCookieValue('scrollY') *1
  //   console.log(scrollY)
  //   console.log(this.listRef)
  //   // this.listRef.measureAllRows()
  //   this.listRef.scrollToPosition(scrollY)
  // }
  // componentWillUnmount(){
  //   document.cookie =`scrollY=${this.scrollY}`
  // }
  render() {
    console.log('render!!')

    return (
      <div className="App">
        <div className="list">
        <WindowScroller
        ref={this._setRef}
        >
          {({ height, isScrolling, onChildScroll, scrollTop }) =>{
            console.log(scrollTop)
            console.log(height)

            this.scrollY = scrollTop
            return(
            <div>
              <div style={{
                height : '200px',
                backgroundColor : '#6ab04c'
              }}>배너 및 상단 영역 Demo
              </div>
              <List
                ref={(ref) => {this.listRef = ref;}}                
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowHeight={this.rowHeight}
                // rowHeight={200}
                rowRenderer={this.renderRow}
                onRowsRendered={this.onRowsRendered}
                rowCount={this.state.list.length}
                scrollTop={scrollTop}
                width={rowWidth}
                // scrollToIndex={this.state.list.length}
              />
            </div>
          )}}
          </WindowScroller>

        </div>
      </div>
    );
  }
}

export default Portal_PureWindow;