import React from 'react';

class Onlinemall_detail extends React.Component {
  render() {
    console.log(this.props.history)
      return (
        
        <div style={{
          textAlign : 'center'
        }}>
          <div style={{
            fontSize : '40px',
            color : 'red'
        }}>{this.props.location.state.omidx}</div>
          <div>
          인덱스 클릭
          </div>
          <button onClick={()=>this.props.history.goBack()}>back</button>
        </div>

        

      )
        
    }
  }


export default Onlinemall_detail;
