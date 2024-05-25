import React, { useState, useEffect } from 'react';
import GlobalLoading from './GlobalLoading'; // Import your GlobalLoading component

const withLoading = (WrappedComponent) => {
  
  return ({ loading, ...props }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Simulate loading for 2 seconds, replace with your actual loading logic
      setTimeout(() => {
        setIsLoading(false);
      }, 10);
    }, []);

    if (isLoading) {
      return <GlobalLoading />;
    }

    return <WrappedComponent {...props} />;
  };
  
};

export default withLoading;
