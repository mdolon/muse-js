import React from 'react';
import ReactDOM from 'react-dom';
import Pagination from "react-js-pagination";
import Listing from '../components/Listing';
import ListingPanel from '../components/ListingPanel';

// Static data sources
import Categories from '../../data/categories';
import Levels from '../../data/levels';
import Locations from '../../data/locations';

class App extends React.Component {
  constructor(props) {
    super(props);

    let i;

    this.api_key = 'e628a73d4cee4b6421da949825e0e60bbb15a33a1b1529c46021862d1942b1bc';
    this.filters = ['company', 'category', 'level', 'location'];
    this.companyList = [];
    this.state = {
      page: 0,
      pageCount: 0,
      descending: false,
      currentListing: null,
      showListingPanel: false,
      results: '',
      refetch: false
    };

    // We bind up here so we don't keep binding on every render
    this.parseResults = this.parseResults.bind(this);
    this.showListingPanel = this.showListingPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.changePage = this.changePage.bind(this);
    this.selectCompany = this.selectCompany.bind(this);

    // Iterate through filters and add to state
    for(i = 0; i < this.filters.length; i++) {
      this.state[this.filters[i]] = [];
    }
  }

  componentDidMount() {
    // Fetch first page of results
    this.fetchResults();

    // Bind categories, levels and locations
    this.createFilters();

    // Dynamically fetch companies
    this.fetchCompanies(0);
  }

  // This will iterate through the data sets and bind addFilter events only once
  createFilters() {
    let dataList = ['level', 'category', 'location'];
    let dataSources = {
      'level': Levels,
      'category': Categories,
      'location': Locations
    };
    let i, source, itemName;

    for(i = 0; i < dataList.length; i++) {
      source = dataList[i];

      this[source + 'List'] = dataSources[source].map((item, i) => {
        itemName = 'check-' + item + '-i';

        return (
          <label className='check-item' key={ i } for={ itemName }>
            <input type='checkbox' id={ itemName } onClick={ this.addFilter.bind(this, source, item) } />
            { item }
          </label>
        );
      });
    }
  }

  // If the item doesn't exist in the array, add it. Otherwise, remove it.
  addFilter(type, item) {
    let index = this.state[type].indexOf(item);
    let cloned = this.state[type].splice(0);

    if(index === -1) {
      cloned.push(item);
    } else {
      cloned.splice(index, 1);
    }
    this.setState({
      [type]: cloned,
      refetch: true
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Decided to use a flag to refetch results, since refetching manipulates
    // state and sends it in a loop otherwise. This lets us be choosy regarding
    // when to run the AJAX call.
    if(this.state.refetch) {
      this.fetchResults();
    }
  }

  changePage(page) {
    // Minus one because paginator starts at 1 while API starts at 0
    this.setState({
      page: page - 1,
      refetch: true
    });
  }

  showListingPanel(listing) {
    this.setState({
      currentListing: listing,
      showListingPanel:
        // Is the panel showing? if not show it!
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

    // Get all the companies
    this.setState({
      page: parsed.page,
      pageCount: parsed.page_count,
      results: parsed.results,
      refetch: false
    });
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

  selectCompany(event) {
    this.setState({
      company: event.target.value == '' ? [] : [event.target.value],
      refetch: true
    });
  }

  fetchCompanies(page) {
    let oReq = new XMLHttpRequest();
    let response, results;

    // Add a callback to XHR so that we can parse the response
    oReq.addEventListener("load", (xhr) => {
      response = JSON.parse(xhr.target.response);
      results = response.results;

      results.map((item) => { this.companyList.push(item.name); });

      // Keep fetching while there are still pages of companies
      while(page < response.page_count) {
        return this.fetchCompanies(page + 1);
      }

      // Force DOM to re-render
      if(page == response.page_count) {
        this.companyList.sort();
        this.setState({ refetch: true });

        console.log('Finished fetching all companies');
      }
    });
    oReq.open("GET", "https://api-v2.themuse.com/companies?page=" + page + "&api_key=" + this.api_key);
    oReq.send();
  }

  buildQuery() {
    let query = 'https://api-v2.themuse.com/jobs?';
    let i, j, filter, item;

    // Add API Key
    query += 'api_key=' + this.api_key;

    // Add page
    query += '&page=' + this.state.page;

    // Add companies, categories, levels, locations and jobs
    for(i = 0; i < this.filters.length; i++) {
      filter = this.filters[i];

      for(j = 0; j < this.state[filter].length; j++) {
        query += '&' + filter + '=' + encodeURIComponent(this.state[filter][j]);
      }
    }

    return query;
  }

  render() {
    let listings, pagination, listingPanel, locations, levels, categories, companies;

    // For each of the results in our array, create a new, stateless Listing item
    if(this.state.results.length > 0) {
      listings = this.state.results.map((item, i) => {
        return (
          <Listing key={ i } showListingPanel={ this.showListingPanel } listing={ item } />
        );
      });

      // And update the paginator
      pagination = (
        <Pagination
          activePage={ this.state.page + 1 }
          totalItemsCount={ this.state.pageCount * 20 }
          onChange={ this.changePage }
        />
      );
    }

    // If we want to show a listing panel, load the component
    if(this.state.showListingPanel) {
      listingPanel = (
        <ListingPanel listing={ this.state.currentListing } closePanel={ this.closePanel } />
      );
    }

    // For each of the companies, create select options
    if(this.companyList.length > 0) {
      companies = this.companyList.map((item, i) => {
        return (<option key={ i } value={ item }>{item}</option>);
      });
    }

    return (
      <div className='muse-app'>
        { listingPanel }
        <div className='filter-panel'>
          <h2>Muse Job Search</h2>
          <p>Use the following filters to search through jobs listed at TheMuse.com:</p>
          <h4>Company</h4>
          <select className='company-select' onChange={ this.selectCompany }>
            <option value=''>Show All</option>
            { companies }
          </select>
          <h4>Category</h4>
          <div className='category-list scroll-list'>
            { this.categoryList }
          </div>
          <h4>Level</h4>
          <div className='level-list'>
            { this.levelList }
          </div>
          <h4>Location</h4>
          <div className='location-list scroll-list'>
            { this.locationList }
          </div>
        </div>
        <div className='content'>
          <h2>Found { this.state.pageCount === 0 ? '0' : (this.state.pageCount * 20) + '+' } Companies</h2>
          <div className='listings'>
            { listings }
          </div>
          { pagination }
        </div>
      </div>
    );
  }
}

export default App;
