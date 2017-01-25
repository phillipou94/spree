import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./LocationPopup.css";
import CurrencyInput from 'react-currency-input';

import Button from "../../Button/Button.jsx";

class LocationPopup extends Component {
  constructor(props) {
    super(props);
    var new_york = {title:"New York City",
                    latitude:40.7128,
                    longitude:-74.0059,
                    image:"https://static.pexels.com/photos/29732/pexels-photo-29732.jpg"};
    var los_angeles = {title:"Los Angeles",
                      latitude:34.0522,
                      longitude:-118.2437,
                      image:"https://c1.staticflickr.com/2/1557/26471199751_d3779cc760_b.jpg"};
    var boston = {title:"Boston",
                  latitude:42.3601,
                  longitude: -71.0589,
                  image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Fort_Point,_Boston_(4775736383).jpg/640px-Fort_Point,_Boston_(4775736383).jpg"};
    var philadelphia = {title:"Philadelphia",
                        latitude:39.9526,
                        longitude:-75.1652,
                        image:"https://upload.wikimedia.org/wikipedia/commons/6/64/Skyline_of_Philadelphia.jpg"};
    var chicago = {title:"Chicago",
                  latitude:41.8781,
                  longitude:-87.6298,
                  image:"https://c1.staticflickr.com/6/5077/5906819981_0c87f2a6a4_b.jpg"};
    var san_francisco = {title:"San Francisco",
                        latitude:37.7749,
                        longitude:-122.4194,
                        image:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Golden_Gate_Br%C3%BCcke_San_Francisco_CA_USA.jpg/1024px-Golden_Gate_Br%C3%BCcke_San_Francisco_CA_USA.jpg"};
    var seattle = {title:"Seattle",
                  latitude:47.6062,
                  longitude:-122.3321,
                  image:"https://c1.staticflickr.com/6/5609/15623134190_1ec594e125_b.jpg"};
    var las_vegas = {title:"Las Vegas",
                    latitude:36.1699,
                    longitude:-115.1398,
                    image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Las_Vegas_89.jpg/1024px-Las_Vegas_89.jpg"};

    var cities = [new_york, los_angeles, boston, philadelphia, chicago, san_francisco, seattle, las_vegas];

    this.state = {
      cities:cities,
      address:""
    }
  }

  didClickCity(city) {
    var coordinates = {latitude:city.latitude, longitude:city.longitude};
    this.props.didSelectLocation(coordinates, city.title)
  }

  updateInputValue(event) {
    this.setState({address:event.target.value});
  }

  didClickGo(event) {
    event.preventDefault();
    console.log(this);
    this.props.didEnterAddress(this.state.address);
  }

  render() {
    var self = this;
    var cityCards = this.state.cities.map(function(city, index) {
      return (
        <div className = {styles.cityCard}
             key = {index}
             onClick = {self.didClickCity.bind(self,city)}>
          <div className = {styles.cityCardInfo}> <p>{city.title}</p></div>
          <img src = {city.image} />
        </div>
      )
    });
    var inputCard = (
      <div className = {styles.inputCard}>
        <p>{"Don't see your city?"}</p>
        <div className = {styles.inputContainer}>
          <form onSubmit = {this.didClickGo.bind(this)}>
          <input className = {styles.addressInput}
                 placeholder={"Enter city or zipcode"}

                 onChange={this.updateInputValue.bind(this)}
          />
        </form>
          <button onClick = {this.didClickGo.bind(this)}>Go</button>
        </div>

      </div>
    )

    return (
      <div className = {styles.LocationPopup}>
        <p className = {styles.exitButton} onClick = {this.props.closePressed}>x</p>
        <p className = {styles.title}>Choose a City</p>
        <div className = {styles.cities}>
          {cityCards}
          {inputCard}
        </div>
      </div>
    );
  }
};

export default withRouter(CSSModules(LocationPopup, styles));
