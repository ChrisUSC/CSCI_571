import React, { Component } from "react";
import { Search } from "semantic-ui-react";
import _ from "lodash";
import AsyncSelect from "react-select/async";
import {Form} from "react-bootstrap";
import { withRouter } from "react-router-dom";

class AutoComplete extends Component {
  state = { results: [], selectedResult: "", inputValue: "" };

  async loadOptions(value) {
    try {
      const response = await fetch(
        `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?mkt=en-us&q=` +
          value,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": "aed5e674cc114285914f21fee9e1829d",
          },
        }
      );
      const data = await response.json();
      const resultsRaw = data.suggestionGroups[0].searchSuggestions;

      const results = resultsRaw.map((result) => ({
        label: result.displayText,
        value: result.displayText,
      }));
      return results

    } catch (error) {
    }
  }

  handleInputChange = (newValue: string) => {

     const inputValue = newValue;
     if(inputValue.label != undefined && inputValue.length > 0){
       console.log(inputValue.label);
       this.setState({ inputValue });
       return inputValue;
     }

   };

   handleOnChange = (newValue: string) => {
      const inputValue = newValue.label;
      console.log(inputValue);
      var newURL = "/search/" + inputValue;
      this.props.history.push(newURL); // val is a key
    };

    searchSubmit = () => {
      console.log("ahh")
      var input = this.state.inputValue;
      console.log(input);

      var newURL = "https://cpackhw8.wl.r.appspot.com" + "/search/" + input;

      window.location.href = newURL;

      this.props.history.push(newURL); // val is a key
    };

  render() {
    return (
      <div style={{width:"200px"}}>
      <AsyncSelect
        loadOptions={this.loadOptions}
        onInputChange={this.handleInputChange}
        onChange={this.handleOnChange}
        value={this.state.inputValue}

      />
      </div>
    );
  }
}

export default withRouter(AutoComplete);
