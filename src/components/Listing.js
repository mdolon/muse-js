import React from 'react';
import ReactDOM from 'react-dom';

class Listing extends React.Component {
  constructor(props) {
    super(props);

    this.showListingPanel = this.props.showListingPanel.bind(this, this.props.listing);
    this.state = {
      showInfo: false
    };
  }

  render() {
    let listingInfo;

    return (
      <div className='listing'>
        { listingInfo }
        <div className='listing-title' onClick={ this.showListingPanel }>{ this.props.listing.name }</div>
      </div>
    )
  }
}

export default Listing;
