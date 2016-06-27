import React from 'react';
import ReactDOM from 'react-dom';

class ListingPanel extends React.Component {
  render() {
    return (
      <div className='listing-info'>
        <span className='close' onClick={ this.props.closePanel }>&times;</span>
        <h3>{ this.props.listing.name }</h3>
        <h5>{ this.props.listing.company.name }, { this.props.listing.locations[0].name } </h5>
        <div className='listing-content' dangerouslySetInnerHTML={{__html: this.props.listing.contents }} />
        <a href={ this.props.listing.refs.landing_page } className='apply-now'>Apply Now</a>
      </div>
    )
  }
}

export default ListingPanel;
