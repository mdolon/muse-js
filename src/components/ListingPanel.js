import React from 'react';
import ReactDOM from 'react-dom';

class ListingPanel extends React.Component {
  render() {
    return (
      <div className='listing-info'>
        <span className='close' onClick={ this.props.closePanel }>&times;</span>
        <h3>{ this.props.listing.name }</h3>
        <h5>{ this.props.listing.company.name }</h5>
        <div className='listing-content' dangerouslySetInnerHTML={{__html: this.props.listing.contents }} />
      </div>
    )
  }
}

export default ListingPanel;
