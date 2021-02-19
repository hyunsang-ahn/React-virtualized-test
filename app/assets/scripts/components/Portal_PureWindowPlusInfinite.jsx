import { List, WindowScroller, InfiniteLoader } from "react-virtualized";
import React from 'react';
import Util from '../utils/util'
const listHeight = 640;
const rowWidth = 360;
class Portal_PureWindowPlusInfinite extends React.Component {
  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
    this.state={
      list : Array(100).fill().map((idx) => {
        return {
          id: idx, 
        }
      }),
      hasMore : true,
      rowCount : Util.getCookieValue('rowCount') ? Util.getCookieValue('rowCount') *1 : 100,
      isLoadList : []
    }
    console.log(this.state.list)
    console.log('constructor!!')
    this.scrollY = 0
    this.scrollToIndex = Util.getCookieValue('scrollToIndex') ? (Util.getCookieValue('scrollToIndex')* 1):(-1) 
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
  //   this.listRef.scrollToPosition(scrollY)

  // }
  // componentWillUnmount(){
  //   document.cookie =`scrollY=${this.scrollY}`
  // }
  isRowLoaded = (index) => {
    if(index.index === this.state.list.length){
      console.log('마지막 로드----추가 로드 필요')
    }
  }
  // componentDidUpdate(prevProps, prevState){
  //   if(prevState.list !== this.state.list){
  //     this.listRef.scrollToPosition(10000)
  //     alert('바뀜!')
  //     // document.cookie=`scrollToIndex=${80}`

  //   }
  // }

  loadMoreRows=({startIndex, stopIndex})=>{
    console.log('startIndex......................',startIndex)
    console.log('stopIndex......................',stopIndex)
    if(this.state.hasMore && stopIndex !== 0 && this.state.list.length === stopIndex){
      console.log('추가로딩!')
      var list = Array(100).fill(1)

   
      this.setState({
        list : this.state.list.concat(list),
        rowCount : this.state.rowCount + 100
        // rowCount : 200
        // hasMore : false
      },()=>{
      // console.log(this.state.rowCount)
      
      document.cookie=`rowCount=${this.state.rowCount}`

      })
    }
  }

  render() {
    console.log('render!!')

    return (
      <div className="App">
        <div className="list">
        <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={this.state.hasMore ? this.state.rowCount + 1 : this.state.rowCount}
            threshold={5}
            >
          {({ onRowsRendered, registerChild }) => {
            console.log(onRowsRendered)
            console.log(registerChild)

            return(
            <WindowScroller
              ref={this._setRef}
              >
          {({ height, isScrolling, onChildScroll, scrollTop }) =>{
            console.log(scrollTop)
            console.log(isScrolling)
            this.scrollY = scrollTop
            return(
            <div>
              <div style={{
                height : '200px',
                backgroundColor : '#6ab04c'
              }}>배너 및 상단 영역 Demo
              </div>
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
                rowCount={this.state.rowCount}
                scrollTop={scrollTop}
                width={rowWidth}
                scrollToIndex={this.state.rowCount}
                // overscanRowCount={this.state.list.length}
              />
            </div>
          )}}
          </WindowScroller>


          )}}
      </InfiniteLoader>


        </div>
      </div>
    );
  }
}

export default Portal_PureWindowPlusInfinite;