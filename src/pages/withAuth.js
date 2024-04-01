import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token not found, redirecting to login...');
        navigate('/login', { replace: true });
      } else {
        console.log('Token found:', token);

        // Set the token in the headers for authorization
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  // Set display name for the wrapped component
  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
};

export default withAuth;