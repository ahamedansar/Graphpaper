import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem', color: 'var(--primary-color)' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3 text-muted fw-medium">{message}</p>
    </div>
  );
};

export default Loader;
