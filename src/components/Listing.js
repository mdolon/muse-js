import React from 'react';
import ReactDOM from 'react-dom';

class Listing extends React.Component {
  constructor(props) {
    super(props);

    this.showListingPanel = this.showListingPanel.bind(this);
  }

  showListingPanel(listing) {
    this.props.showListingPanel(this.props.listing);
  }

  render() {
    let listingInfo;

    return (
      <div className='listing-item' onClick={ this.showListingPanel }>
        { listingInfo }
        <div className='listing-title'>{ this.props.listing.name }</div>
      </div>
    );
  }
}

export default Listing;
