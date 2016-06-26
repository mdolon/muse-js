import React from 'react';
import ReactDOM from 'react-dom';
import Listing from '../components/Listing';
import ListingPanel from '../components/ListingPanel';

class App extends React.Component {
  constructor(props) {
    super(props);

    let i;

    this.filters = ['company', 'category', 'level', 'location'];
    this.state = {
      page: 0,
      pageCount: 0,
      descending: false,
      currentListing: null,
      showListingPanel: false,
      results: ''
    };

    this.parseResults = this.parseResults.bind(this);
    this.showListingPanel = this.showListingPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);

    // Iterate through filters and add to state
    for(i = 0; i < this.filters.length; i++) {
      this.state[this.filters[i]] = [];
    }
  }

  componentDidMount() {
    // Fetch first page of results
    this.fetchResults();
  }

  showListingPanel(listing) {
    this.setState({
      currentListing: listing,
      showListingPanel:
        (listing === this.state.currentListing && this.state.showListingPanel) ? false : true
    });
  }

  closePanel() {
    this.setState({
      currentListing: null,
      showListingPanel: false
    });
  }

  parseResults(xhr) {
    const parsed = JSON.parse(xhr.currentTarget.response);

    this.setState({
      page: parsed.page,
      pageCount: parsed.page_count,
      results: parsed.results
    });

    console.log(parsed.results[0]);
  }

  fetchResults() {
    // Build up the query based on current state
    const query = this.buildQuery();

    // Create new XML Request
    let oReq = new XMLHttpRequest();

    // Add a callback to XHR so that we can parse the response
    oReq.addEventListener("load", this.parseResults);
    oReq.open("GET", query);
    oReq.send();
  }

  buildQuery() {
    let query = 'https://api-v2.themuse.com/jobs?';
    let i, j, filter;

    // Add page
    query += 'page=' + this.state.page;

    // Add companies, categories, levels, locations and jobs
    for(i = 0; i < this.filters.length; i++) {
      filter = this.filters[i];
      for(j = 0; j < this.state[filter].length; j++) {
        query += '&' + filter + '=' + this.state[filter];
      }
    }

    return query;
  }

  render() {
    let listings, listingPanel;

    if(this.state.results.length > 0) {
      listings = this.state.results.map((item, i) => {
        return (
          <Listing key={ i } showListingPanel={ this.showListingPanel } listing={ item } />
        );
      });
    }

    if(this.state.showListingPanel) {
      listingPanel = (
        <ListingPanel listing={ this.state.currentListing } closePanel={ this.closePanel } />
      );
    }

    return (
      <div className='muse-app'>
        { listingPanel }
        <div className='header'>
          <h2>Muse Job Search</h2>
        </div>
        <div className='listings'>
          { listings }
        </div>
      </div>
    );
  }
}

export default App;
