import { List, WindowScroller,   CellMeasurer,
  CellMeasurerCache,AutoSizer  } from "react-virtualized";
import React from 'react';
import Util from '../utils/util'
const rowCount = 100;
const listHeight = 640;
const rowWidth = 360;

class Portal_CellMeasurer extends React.Component {
  constructor() {
    super();
    this.state={
      list : Array(rowCount).fill().map((val, idx) => {
        return {
          id: idx, 
          name: 'John Doe',
          image: 'http://via.placeholder.com/40',
        }
      }),
      scrollTop : 19000
    }
    console.log('constructor!!')
  }
  cache = new CellMeasurerCache({
    defaultHeight: 100,
    fixedWidth: true,
    minHeight : 50
  });
  rowRenderer = ({ index, style, key, parent }) => {
    return (
<CellMeasurer cache={this.cache} columnIndex={0} rowIndex={index} key={key} parent={parent}> 
{({ measure, registerChild }) => 
{console.log(this.cache)
return( 
  <div ref={registerChild} style={style}
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
<img onLoad={measure} src="https://picsum.photos/200/300" />{index} 
</div> )}} 
</CellMeasurer>

    );
  }


  onRowsRendered = ({ startIndex, stopIndex }) => {
    console.log('startIndex........', startIndex)
    console.log('stopIndex........', stopIndex)
    // cache.clearAll();
    console.log(this.listRef)
    if(this.listRef){
      // this.listRef.scrollToPosition(20000)
      this.listRef.forceUpdate()
    }
  };
  componentDidMount(){
    console.log('CDM')
    // console.log(this.listRef)
    // cache.clearAll();
    setTimeout(() => {
      window.scrollTo(0,19000)
    }, 1000);
    console.log(this.scrollElement)
    // this.listRef.scrollToPosition

  }
  

  componentDidUpdate(prevProps, prevState){
    console.log(prevProps)
    console.log(this.props)

  }


  render() {
    console.log('render!!')
    return (
      <div
      className="WindowScrollerWrapper"
      ref={el => this.scrollElement = el}
    >
      <div style={{
        height : '200px',
        backgroundColor : '#6ab04c'
      }}>배너 및 상단 영역 Demo
      </div>
        <WindowScroller scrollElement={this.scrollElement}>
          {({ height, isScrolling, onChildScroll, scrollTop }) =>{
            return(
            <AutoSizer disableHeight={true} onResize={this._onResize}>
        {({ width }) => (
              <List
                deferredMeasurementCache={this.cache}
                ref={(ref) => {this.listRef = ref}}                
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                // rowHeight={this.getRowHeight}
                //rowHeight={100}
                rowHeight={this.cache.rowHeight}

                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                rowCount={this.state.list.length}
                scrollTop={scrollTop}
                width={width}
              />
   
            )}
            </AutoSizer>
          )
          }}
          </WindowScroller>
        </div>
    );
  }
}

export default Portal_CellMeasurer;