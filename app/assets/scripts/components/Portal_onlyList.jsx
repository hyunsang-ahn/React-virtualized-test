import { List, WindowScroller } from "react-virtualized";
import React, { useState, useRef } from 'react';
import Util from '../utils/util'
const rowCount = 100;
const listHeight = 640;
const rowWidth = 360;
class Portal_onlyList extends React.Component {

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
    this.listRef = React.createRef()
    this.scrollY = 0
  }

  renderRow({ index, key, style }) {
    // console.log('____________', index);

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
     }}
  // onRowsRendered = ({ startIndex, stopIndex }) => {
  //   console.log('startIndex........', startIndex)
  //   console.log('stopIndex........', stopIndex)

  // };
  componentDidMount(){
    console.log('CDM')
    var scrollY = Util.getCookieValue('scrollY') *1
    console.log(scrollY)
    this.listRef.scrollToPosition(scrollY)
    // console.log(this.listRef.scrollToPosition(17000))
  }
  componentWillUnmount(){
    document.cookie =`scrollY=${this.scrollY}`
  }
  onScroll = ({clientHeight, scrollHeight, scrollTop}) => {
    console.log(clientHeight)
    console.log(scrollHeight)
    console.log(scrollTop)
    this.scrollY = scrollTop
  }

  render() {
    return (
              <List
                ref={(ref) => {this.listRef = ref;}}                
                height={640}
                rowHeight={this.rowHeight}
                onRowsRendered={this.onRowsRendered}
                rowRenderer={this.renderRow}
                rowCount={this.state.list.length}
                width={rowWidth}
                onScroll={this.onScroll}
                // scrollToIndex={20}
                // scrollToAlignment="auto"
                // scrollTop={this.scrollY}
              >
              {/* <div style={{
                height : '200px',
                backgroundColor : 'red'
              }}>배너 및 상단 영역 Demo
              </div> */}
              </List>


  
    )
  }
}

export default Portal_onlyList;