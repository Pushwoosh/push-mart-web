import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import './Recommendations/Recommendations.css';

function NotFound() {
  return (
    <Layout showNavigation headerText="Page not found">
      <div className="text-center">
        <p>We could not find this page.</p>
        <Link className="btn btn-primary" to="/products">Continue shopping</Link>
        {/* The no-code path: a shop pastes this div into its 404 template, WebSDK fills it. */}
        <div
          className="recommendations-widget"
          data-pw-recommendations
          data-pw-strategy="viewed"
          data-pw-fallback="bestsellers_30d"
          data-pw-limit="4"
          data-pw-title="You viewed"
          data-pw-fallback-title="Popular right now"
          data-pw-block="404-viewed"
          data-pw-min-height="260"
        />
      </div>
    </Layout>
  );
}

export default NotFound;
