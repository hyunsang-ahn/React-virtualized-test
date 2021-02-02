import { List, WindowScroller } from "react-virtualized";
import React from 'react';
import Util from '../utils/util'


class Portal_pure extends React.Component {
  constructor(props){
    super(props)
    console.log(this.props.history)

    this.list = []
    for (var step = 0; step < 100; step++) {
      this.list.push(step)
    }
  }
  renderRow(index) {
    return (
      <div 
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
      </div>)
  }

  render() {
    return(
      <div>
        {this.list.map(c=>{
      return(
        <div>{this.renderRow(c)}</div>
      )})}
      </div>
    )

  }
}

export default Portal_pure;