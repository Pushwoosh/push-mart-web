import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { fetchRecommendations, trackRecommendationClick } from '../../tracking/recommendations';
import './Recommendations.css';

// Feed links are absolute and carry the pw_block/utm marker; our own origin stays in the SPA.
const localPath = (url) => {
  try {
    const parsed = new URL(url, window.location.href);
    return parsed.origin === window.location.origin ? `${parsed.pathname}${parsed.search}` : null;
  } catch (e) {
    return null;
  }
};

class Recommendations extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], strategy: 'none' };
    this.generation = 0;
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.request) !== JSON.stringify(this.props.request)) {
      this.load();
    }
  }

  componentWillUnmount() {
    this.generation += 1;
  }

  load() {
    this.generation += 1;
    const { generation } = this;
    fetchRecommendations(this.props.request)
      .catch(() => ({ items: [], strategy: 'none' }))
      .then(({ items, strategy }) => {
        if (generation === this.generation) {
          this.setState({ items: items || [], strategy });
        }
      });
  }

  render() {
    const { items, strategy } = this.state;
    const { request, title, fallbackTitle } = this.props;
    if (!items.length) {
      return null;
    }

    return (
      <section className="recommendations">
        <h4>{strategy !== request.strategy && fallbackTitle ? fallbackTitle : title}</h4>
        <ul className="recommendations__list">
          {items.map((item, index) => {
            const onClick = () => trackRecommendationClick({
              block: request.block, strategy, productId: item.id, position: index + 1,
            });
            const body = (
              <>
                <img className="recommendations__image" src={item.image_url} alt={item.title} />
                <span className="recommendations__name">{item.title}</span>
                <span className="recommendations__price">{item.price_formatted}</span>
              </>
            );
            const path = localPath(item.url);
            return (
              <li key={item.id} className="recommendations__item">
                {path
                  ? <Link to={path} onClick={onClick}>{body}</Link>
                  : <a href={item.url} onClick={onClick}>{body}</a>}
              </li>
            );
          })}
        </ul>
      </section>
    );
  }
}

Recommendations.propTypes = {
  request: PropTypes.shape({
    strategy: PropTypes.string.isRequired,
    block: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  fallbackTitle: PropTypes.string,
};

Recommendations.defaultProps = {
  fallbackTitle: 'Popular right now',
};

export default Recommendations;
