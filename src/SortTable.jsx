import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import React, { Component}  from 'react';
import {Logger, ConsoleLogger} from 'react-console-logger';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
const myLogger = new Logger();
var $ = require("jquery");

let order = 'desc';

class SortTable extends React.Component {
  
    constructor() {
      super();
      
      this.state = {
        irs_data:[],
        isDataFetched: false,
        zipcode : "91364"
      };
      this.fetchData = this.fetchData.bind(this);
    }
	componentDidMount() {
      this.loadData()
    }

    loadData() {
      $.ajax({
         url: 'http://127.0.0.1:3001/scrape_irs?zipcode='+this.state.zipcode,
         //url: 'out.json',
         dataType: 'json',
         success: function(irs_data) {
		   console.log(irs_data);
           this.setState({irs_data: irs_data});
            }.bind(this)
        });
   }
   fetchData() {   
    let me = this;  
    fetch("http://localhost:3001/scrape_irs?zipcode=91360")  
    .then(  
      function(response) {  
        if (response.status !== 200) {            
          return;  
        }
        response.json().then(function(data) {  
          me.setState({irs_data: data.table,  isDataFetched: true });   
        });  
      }  
    )  
    .catch(function(err) { 
      me.setState({isDataFetched: true}); 
      console.log("Fetch Error :-S", err);         
    });
  }
  
  
  handleBtnClick = () => {
   this.state.zipcode=document.getElementById("zipcode").value 
   this.setState({zipcode : document.getElementById("zipcode").value})
   this.loadData()
  }

  render() {
  
	return (
      <div>
        <p style={ { color: 'red' } }>You can click on any header to sort</p>
        <button onClick={ this.handleBtnClick }>ZipCode</button><input type="text" name="zipcode" pattern="[0-9]{5}" title="Five digit zip code" id="zipcode"/>
        <BootstrapTable ref='table' data={ this.state.irs_data.table }>
            <TableHeaderColumn dataField='Name' isKey={ true } dataSort={ true }>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='Address' dataSort={ true }>Address</TableHeaderColumn>
            <TableHeaderColumn dataField='Contact' dataSort={ true }>Contact</TableHeaderColumn>
			<TableHeaderColumn dataField='Phone' dataSort={ true }>Phone</TableHeaderColumn>
			<TableHeaderColumn dataField='type' dataSort={ true }>type</TableHeaderColumn>
        </BootstrapTable>
       
 >
      </div>
      
     
    );
 
  }
}
export default SortTable;
