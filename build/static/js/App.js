import React, { Component } from 'react';
import './css/bootstrap.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {

    // Get access token to be able to fetch data from the Spotify API
    constructor() {
      super();
      const params = this.getHashParams();
      const token = params.access_token;
      if (token) {
          spotifyApi.setAccessToken(token);
      }
      this.state = {
          loggedIn: token ? true : false,
          spotifyAccount: {accountName: 'Not Logged In', accountPic: ''}
      }
    }

    // Using code from authorization_code/public/index.html
    // (https://github.com/spotify/web-api-auth-examples)
    // Extracts token params from hash string of the URL into an object with key-value pairs.
    getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      e = r.exec(q)
      while (e) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
         e = r.exec(q);
      }
      return hashParams;
    }

    // Request API data
    // Using library provided by JMPerez/spotify-web-api-js
    // (https://github.com/JMPerez/spotify-web-api-js)
    getConnectedAccount() {
        spotifyApi.getMe()
            .then((response) => {
                this.setState( {
                    spotifyAccount: {
                        accountName: response.display_name,
                        accountPic: response.images[0].url
                    }
                });
            })
    }

    joinRoom() {
        // 
    }

    // Display our data
    render() {
        return (
          <div className="App">
            <h1 class="cover-heading">DJFY</h1>
            <div>
                Spotify Account: {this.state.spotifyAccount.accountName}
            </div>
            <div>
                <img src={this.state.spotifyAccount.accountPic} style={{ height: 100 }}/>
                <br /> <br />
            </div>

            {/* Show button to check spotify account */}
            {
                this.state.loggedIn &&
                <button class="btn btn-sm btn-primary" onClick={() => this.getConnectedAccount()}>
                    ShowAccount
                </button>
            }

            <br /> <br /> <br />
            <p>
                Connect to Spotify &nbsp;
                <a href="https://djfy-backend-server.herokuapp.com/login" class="btn btn-lg btn-secondary">Connect</a>

                &nbsp;&nbsp;&nbsp;&nbsp;{/* Adding space in between the two buttons */}

                Join Room &nbsp;
                <button class="btn btn-lg btn-secondary" onClick={() => this.joinRoom()}>Join</button>
            </p>

            <Room> </Room>

          </div>
        );
    }
}

class Room extends Component {
    render() {
      return (
        <div className="Room">
        <h2>Playlist</h2>

        <ul>
            Search: <input type = "text"/>
            <br/> <br/>

            <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button> Song 1</li>
            <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button> Song 2</li>
            <li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button> Song 3</li>
        </ul>
      </div>
      );
    }
}

export default App;

