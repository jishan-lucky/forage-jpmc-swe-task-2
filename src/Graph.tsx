import React, { Component } from 'react';

// Define the interface for props
interface IProps {
  data: any[];
}

// Define the interface for state
interface IState {}

class Graph extends Component<IProps, IState> {
  private element: PerspectiveViewerElement | null = null;

  // Update the graph when component mounts or updates
  componentDidUpdate(prevProps: IProps) {
    if (this.element && prevProps.data !== this.props.data) {
      this.updateGraph();
    }
  }

  // Initialize the graph when component mounts
  componentDidMount() {
    this.element = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;
    if (this.element) {
      this.updateGraph();
    }
  }

  // Update the graph with new data
  updateGraph() {
    if (this.element) {
      this.element.setAttribute('view', 'y_line');
      this.element.setAttribute('column-pivots', '["stock"]');
      this.element.setAttribute('row-pivots', '["timestamp"]');
      this.element.setAttribute('columns', '["top_ask_price"]');
      this.element.setAttribute('aggregates', JSON.stringify({
        top_ask_price: 'avg',
        top_bid_price: 'avg'
      }));

      // Load data into the graph
      this.element.load(this.props.data);
    }
  }

  render() {
    return (
      <div>
        <perspective-viewer />
      </div>
    );
  }
}

export default Graph;
