import React, { Component } from 'react';
import LoadingOverlay from './LoadingOverlay';
import GlobalLoading from './GlobalLoading'; // Import your GlobalLoading component

const withLoadingOverlay = (WrappedComponent) => {
  return class WithLoadingOverlay extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
      };
    }

    startLoading = () => {
      this.setState({ isLoading: true });
    };

    stopLoading = () => {
      this.setState({ isLoading: false });
    };

    render() {
      const { isLoading } = this.state;

      return (
        <React.Fragment>
          <WrappedComponent
            startLoading={this.startLoading}
            stopLoading={this.stopLoading}
            {...this.props}
          />
          {isLoading && <LoadingOverlay />}
        </React.Fragment>
      );
    }
  };
};

export default withLoadingOverlay;
