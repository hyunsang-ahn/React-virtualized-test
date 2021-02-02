import { List, WindowScroller } from "react-virtualized";
import React from 'react';
import Util from '../utils/util'
const rowCount = 100;
const listHeight = 640;
const rowWidth = 360;

class Portal extends React.Component {
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

  }

  // handle = () => {
  //   this.state.list = [...this.state.list, { id: 1001, name: "haha", image: '', text: 'hahahahahaha' }];
  //   this.forceUpdate();
  //   // this.refs.List.scrollToRow(this.state.list.length);
  // };

  // // Check the change of the list, and trigger the scroll
  // componentDidUpdate(prevProps, prevState) {
  //   console.log('componentDidUpdate!!!')
  //   if (this.state.list.length !== prevState.list.length) {
  //     this.refs.List.scrollToRow(this.state.list.length);  
  //   }
  // }
  renderRow({ index, key, style }) {
    console.log('____________', index);
    console.log(' document.documentElement.scrollTop', document.documentElement.scrollTop);

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
        document.cookie=`scrollY=${document.documentElement.scrollTop}`
      }}
      >
        {index %2 === 0 ? (
          <div style={{
            height : '120px',
            width : '100%',
            backgroundColor : 'blue',
          }}>현재 위치는 index : {index}</div>
        ):(
          <div style={{
            height : '240px',
            width : '100%',
            display : 'flex'
          }}>
          <div style={{
            height : '240px',
            width : '50%',
            backgroundColor : 'yellow',
            display : 'inline-block'
          }}>현재 위치는 index : {index}</div>
          <div style={{
            height : '240px',
            width : '50%',
            backgroundColor : 'black',
            display : 'inline-block'

          }}/>
          </div>
        )}
   

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
   jumpToRow =() =>{
     this.setState({
       scrollToRow : 77
     },()=>{
       alert(this.state.scrollToRow)
     })
   }
   componentDidMount(){
    console.log('componentDidMount!!')

    this.docReady(function() {
      // DOM is loaded and ready for manipulation here
      // var scrollY = Util.getCookieValue('scrollY')  * 1
      // window.scrollTo(0,scrollY)
      console.log(this.listRef)
  });
   }
   docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}    

  listRef = React.createRef();

  onRowsRendered = ({ startIndex, stopIndex }) => {
    console.log('startIndex........', startIndex)
    console.log('stopIndex........', stopIndex)
    console.log(this.listRef.current)
    if(this.listRef.current){
      console.log('scrollTop........................',
        this.listRef.current.props.scrollTop
      )
      console.log('scrollToIndex........................',
        this.listRef.current.props.scrollToIndex
      )
      console.log('scrollToRow........................',
        this.listRef.current.props.scrollToRow
      )
    }
    // this.listRef.current.scrollToRow(startIndex)
  };
  render() {
    console.log('render!!')
    console.log(this.refs)
    return (
      <div className="App">
        <div className="list">
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) =>{
            console.log(scrollTop) 
            console.log(isScrolling) 
            return(
            <div>
              <div style={{
                height : '200px',
                backgroundColor : 'red'
              }}>배너 및 상단 영역 Demo
              <div onClick={this.jumpToRow}>이동버튼</div>
              </div>
              <List
                ref={this.listRef}
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowHeight={this.rowHeight}
                rowRenderer={this.renderRow}
                onRowsRendered={this.onRowsRendered}

                rowCount={this.state.list.length}
                scrollTop={17239}
                width={rowWidth}


              />
            </div>

          )}}
          </WindowScroller>

        </div>
      </div>
    );
  }
}

export default Portal;