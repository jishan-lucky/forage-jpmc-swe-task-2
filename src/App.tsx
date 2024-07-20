import React, { Component } from 'react';
import Graph from './Graph'; // Import the Graph component

// Define the interface for the state
interface IState {
  data: any[];
  showGraph: boolean;
}

// App component
class App extends Component<{}, IState> {
  private interval: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      data: [],
      showGraph: false
    };
  }

  // Fetch data from the server continuously
  getDataFromServer = () => {
    this.interval = setInterval(() => {
      fetch('your-server-url') // Replace with your server URL
        .then(response => response.json())
        .then(data => this.setState(prevState => ({
          data: this.aggregateData(prevState.data.concat(data))
        })));
    }, 1000); // Adjust the interval as needed
  };

  // Aggregate duplicate data
  aggregateData(data: any[]) {
    const aggregated = new Map();
    data.forEach(item => {
      const key = `${item.stock}-${item.timestamp}`;
      if (aggregated.has(key)) {
        const existing = aggregated.get(key);
        existing.top_ask_price = (existing.top_ask_price + item.top_ask_price) / 2;
        existing.top_bid_price = (existing.top_bid_price + item.top_bid_price) / 2;
      } else {
        aggregated.set(key, item);
      }
    });
    return Array.from(aggregated.values());
  }

  // Start streaming data and show the graph
  startStreaming = () => {
    this.setState({ showGraph: true }, () => {
      this.getDataFromServer();
    });
  };

  // Render the graph based on the state
  renderGraph() {
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
    return null;
  }

  // Clear interval when component unmounts
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.startStreaming}>Start Streaming Data</button>
        {this.renderGraph()}
      </div>
    );
  }
}

export default App;
