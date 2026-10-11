import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

function NotFound() {
  return (
    <Layout showNavigation headerText="Page not found">
      <div className="text-center">
        <p>We could not find this page.</p>
        <Link className="btn btn-primary" to="/products">Continue shopping</Link>
      </div>
    </Layout>
  );
}

export default NotFound;
