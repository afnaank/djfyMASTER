/**
 * DJFY app code built using React App
 *
 * When running locally,
 * change connect-spotify button link to "http://localhost:8888/login"
 *
 */

import React, { Component } from 'react';
import './bootstrap.css';

// Use Spotify Web API JS Wrapper,
// provided by https://github.com/JMPerez/spotify-web-api-js
import SpotifyWebApi from 'spotify-web-api-js';

// Create object to make the API calls
const spotifyApi = new SpotifyWebApi();


class App extends Component {

    // Get access token to be able to fetch data from the Spotify API
    constructor() {
        super();

        // Extract and set spotify access token returned from URL
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }

        // Set variables only if we have token
        this.state = {
            loggedIn: token ? true : false,
            spotifyAccount: {accountName: 'Not Logged In', accountPic: ''}
        }
    }

    // Extracts token params from hash string of the URL into an object with key-value pairs.
    // Using code provided by https://github.com/spotify/web-api-auth-examples
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

    // Request account data using API,
    // and update variables with returned data
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

    // Display our data
    render() {
        return (
            <div className="App">
                <h1 class="cover-heading">DJFY</h1>

                {/* Show account name and pic */}
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
                    <button class="btn btn-sm btn-secondary" onClick={() => this.getConnectedAccount()}>
                        Check Account
                    </button>
                }

                {/* Connect & Join buttons */}
                <br /> <br /> <br /> <br />
                <p>
                    Connect to Spotify &nbsp;
                    <a href="https://djfy-backend-server.herokuapp.com/login" class="btn btn-lg btn-primary">Connect</a>

                    &nbsp;&nbsp;&nbsp;&nbsp;{/* Adding space in between the two buttons */}

                    Join Room &nbsp;
                    <button class="btn btn-lg btn-secondary" onClick={() => this.joinRoom()}>Join</button>
                </p>


            </div>
        );
    }
}

export default App;
