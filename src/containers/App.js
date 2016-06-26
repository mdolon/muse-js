import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);

    let i;

    this.filters = ['company', 'category', 'level', 'location'];
    this.state = {
      page: 0,
      descending: false,
      results: ''
    };

    // Iterate through filters and add to state
    for(i = 0; i < this.filters.length; i++) {
      this.state[this.filters[i]] = [];
    }
  }

  componentDidMount() {
    // Fetch first page of results
    this.buildQuery();
  }

  parseRequest(xhr) {
    const parsed = JSON.parse(xhr.currentTarget.response);

    console.log(parsed);
  }

  fetchResults() {
    // Build up the query based on current state
    const query = this.buildQuery();

    // Create new XML Request
    let oReq = new XMLHttpRequest();

    // Add a callback to XHR so that we can parse the response
    oReq.addEventListener("load", this.parseRequest.bind(this));
    oReq.open("GET", query);
    oReq.send();
  }

  buildQuery() {
    let query = 'https://api-v2.themuse.com/jobs?';
    let i, j, filter;

    // Add page
    query += 'page=' + this.state.page;

    console.log(this.state);

    // Add companies, categories, levels, locations and jobs
    for(i = 0; i < this.filters.length; i++) {
      filter = this.filters[i];
      for(j = 0; j < this.state[filter].length; j++) {
        query += '&' + filter + '=' + this.state[filter];
      }
    }

    console.log(query);
    return query;
  }

  render() {
   return(
     <div className='muse-app'>
       <div className='header'>
         <h2>Muse Job Search</h2>
       </div>
     </div>
   );
  }
}

export default App;
