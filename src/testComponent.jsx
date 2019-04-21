import React, { Component } from 'react';

class TestComponent extends Component {

  render() {
    console.log("Hello")
    return (
      <React.Fragment>
          <div>Hello</div>
      </React.Fragment>
    );
  }
}

export default TestComponent;
