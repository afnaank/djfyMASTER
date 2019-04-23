/**
* DJFY Web App code
*
*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import './css/bootstrap.css';
import './css/cover.css';
import SpotifyWebApi from 'spotify-web-api-js';
//import url from 'url-parameters';

const urlListener = require('url-listener')

urlListener(event => {
  // your logic here!
  console.log('URL UPDATED!')
})

var spotifyApi = new SpotifyWebApi();
var tracks = [];
var searchTracks = [];
var listSearchTracks;
var listTracks; //= tracks.map((tracks) =>
  //<li><button style = {{width: 25, height: 25, borderWidth: 3, fontSize: 15, backgroundColor: '#FF0000'}}>-</button>{tracks}</li>
//);
var trackToggle;
//var snapshot = '';
//var currentTrack = '';
//var mainid = '';
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background: '#282c34',
  }
};
var hereIsThis = this;
Modal.setAppElement(document.getElementById('app'));
class App extends Component {

  //This checks if there is a playlist ID currently in the URL
  //this is for the guest users that have the shared link
  //it should immediately print the playlist tracks/info
   isTherePlaylistID() {
    var idCheck = this.getUrlParams2("playlist_id");
    if(idCheck && idCheck.length >2) {
      console.log("WE HAVE A PLAYLIST ID IN THE URL: " + idCheck);
      this.getPlaylistHelper(idCheck);

    }
  }
    // Get access token to be able to fetch data from the Spotify API
    constructor(props) {
      super(props);
      const token = this.getUrlParams2("access_token");
      console.log("token: " + token);
      if (token) {
        console.log("setting token...");
          spotifyApi.setAccessToken(token);
      }
      this.isTherePlaylistID();
      this.state = {
          loggedIn: token ? true : false,
          spotifyAccount: {accountName: 'Not Logged In', accountPic: '', Id: ''},

          playlistName:'',
          roomCode: '',
          value: '',
          isCreated: false,
          };

          this.handleChange = this.handleChange.bind(this);
         // this.handleSearch = this.handleSearch.bind(this);

          //this.getHashParams = this.getHashParams.bind(this);
          this.getConnectedAccount = this.getConnectedAccount.bind(this);
          this.createNewPlaylist = this.createNewPlaylist.bind(this);
          this.createNewPlaylistCallback = this.createNewPlaylistCallback.bind(this);
          this.createNewPlaylistHelper = this.createNewPlaylistHelper.bind(this);
          this.getPlaylistHelper = this.getPlaylistHelper.bind(this);
          this.getPlaylistTracksCallback = this.getPlaylistTracksCallback.bind(this);
          this.search = this.search.bind(this);
          this.searchHelper = this.searchHelper.bind(this);
          this.getTrack = this.getTrack.bind(this);
          this.addTracks = this.addTracks.bind(this);
          this.removeTracks = this.removeTracks.bind(this);
          this.render = this.render.bind(this);
          this.openModal = this.openModal.bind(this);
          this.afterOpenModal = this.afterOpenModal.bind(this);
          this.closeModal = this.closeModal.bind(this);
          this.addTracksCallBack = this.addTracksCallBack.bind(this);
          //this.forceUpdate = this.forceUpdate.bind(this);
      }

      openModal() {
        this.setState({modalIsOpen: true});
      }

      afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.subtitle.style.color = '#f00';
      }

      closeModal() {
        this.setState({modalIsOpen: false});
        window.location.reload();
      }

    handleChange(event) {
        this.setState({value: event.target.value});
      }

    handleSearch(event) {
        this.search(this.state.search);
    }

    changePlaylistName = (event) =>  {
        this.setState({
        playlistName: event.target.value
          })
    }

  getUrlParams2( prop ) {
    var params = {};
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '#' ) + 1 ) );
    var definitions = search.split( '&' );

    definitions.forEach( function( val, key ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );

    return ( prop && prop in params ) ? params[ prop ] : params;
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
                        accountPic: response.images[0].url,
						            Id: response.id
                    }
                });
            })
            var token = this.getUrlParams2("access_token");

           spotifyApi.setAccessToken(token);

    }

    /*joinRoom() {
          var x = document.getElementById("joinroom");
          var text = "";
          text = x.elements[0].value;
          console.log("code: " + text);
          //check if its a legal inputted code (4 capital characters)
          if(this.state.value.length == 4){
            //check if the database has the inputted code
            if(false/* inDatabase(this.state.value.toUpperCase()){
              //if the database has that code, display the corresponding playlist
              //enter room
            }
            else{
              //if it doesnt then error out
              alert(this.state.value.toUpperCase() + " is an invalid room code.");
            }
          }
          else{
            alert(this.state.value.toUpperCase() + " is an invalid room code. \nRoom codes are 4 characters long.")
          }

  }*/

  /*makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     for (var i = 0; i < length; i++)
       text += possible.charAt(Math.floor(Math.random() * possible.length));
     return text;
   }*/

  async createNewPlaylistHelper(id, name) {
    console.log("helper id: "+ id);
    await this.createNewPlaylist(id, name);
    var playlistID = this.getUrlParams2("x");
    console.log("here is the playlist ID: "+ playlistID);
  }

  createRoom() {
    if (this.state.loggedIn) {
        this.setState( {
          //roomCode: this.makeid(4),
          playlistName: this.state.value
        })

        var x = document.getElementById("createroom");
        var playlistname = "";
        playlistname = x.elements[0].value;
        var token = this.getUrlParams2("access_token");
        fetch('https://api.spotify.com/v1/me', {headers: {'Authorization':'Bearer ' + token}})
            .then(response => response.json())
            .then(data => this.createNewPlaylistHelper(data.id,playlistname));
        console.log("back in createRoom()");
        spotifyApi.setAccessToken(token);
      }
    else {
        //get room code input
        //enter room
        alert("You need to connect to Spotify before you can create a room.");
    }
}


//Callback function thats called when after spotify API runs getPlaylistTracks()
//error is an error object, null if no error
//value is the value if the request succeeded
//This prints the total tracks, adds the tracks to the tracks array, and prints them
getPlaylistTracksCallback(error, value) {
  console.log("error: " + error);
  console.log("in the callback...totala: "+ value.total);
  var total = value.total;
  console.log("total assigned: "+ total);
  var i;
  for(i=0; i<value.total; i++) {
    tracks.push(value.items[i].track); //name of the track
    console.log("track: " + tracks[i]);
    //console.log("track " + i + value.items[i].track.name);
  }  //
  //displays all the tracks, the corresponding buttons will call getSNIDtoremoveTracks(trackURI)
  //set the button id to the uri of the track. this is so when we do e.target.id, itll actually be passing in the track.uri
  listTracks = tracks.map((tracks) =>
  <li key={tracks.id}><button id= {tracks.uri} onClick={e => hereIsThis.getSNIDtoremoveTracks(e.target.id)} class="btn btn-danger"> - </button> {tracks.name} by {tracks.artists[0].name}</li>
);

hereIsThis.forceUpdate();
//this.setState({listTracks});
 // this.render().bind(this);
 //ReactDOM.render();
}

//this calls getPlaylistTracks given the playlist ID
getPlaylistHelper(playlistID) {
  console.log("getting playlist..." + playlistID);
  hereIsThis = this;
  var token = this.getUrlParams2("access_token");
  spotifyApi.setAccessToken(token);
  spotifyApi.getPlaylistTracks(playlistID,this.getPlaylistTracksCallback);
}

//Callback function thats called when after spotify API runs createPlaylist()
//error is an error object, null if no error
//value is the value if the request succeeded
//adds the playlist id as a url parameter
//calls getPlaylistHelper() after getting the playlist id
createNewPlaylistCallback(error, value) {

   console.log("2error: "+error);
   var playlistID = value.id;

   console.log("playilstID: " + playlistID);
   var url = window.location.href + "&playlist_id=" + playlistID;
   console.log("2URL TO SHARE: " + url);
   this.getPlaylistHelper(playlistID);

   window.location.assign(url);
   window.location.href = url;

   var idcheck = this.getUrlParams2("playlist_id");
   console.log("playlist id from params: " + idcheck);

   //return playlistID;
  }


//id is the user id, playlist name is what the user inputs as the name
//calls createPlaylist() from the spotify api
//has createNewPlaylistCallback as callback function
createNewPlaylist(id, playlistname)	{
  //var playlistID;
  spotifyApi.createPlaylist(id,{name:playlistname},this.createNewPlaylistCallback);
  //console.log("left createNewPlaylist");
}

	/*search(q) {
		spotifyApi.search(q, 'track')
		.then((response) => {
			this.setState( {
				results: response.track.items
			});
		})
		var list = this.state.results.map((results) =>
			<li>{this.state.results.name}</li>
		);
	}*/

	getTrack(traId) {
		spotifyApi.getTrack(traId)
			.then((response) => {
				this.setState( {
					newTrack: response.uri
				});
			})
	}

	addTracks(uri) {
    console.log("this is being removed..." + uri);
    var playlistID = this.getUrlParams2("playlist_id");
    var token = this.getUrlParams2("access_token");
    spotifyApi.setAccessToken(token);
    //spotifyApi.addTracksToPlaylist(playlistID, [uri], this.addTracksCallBack);
    spotifyApi.addTracksToPlaylist(playlistID, [uri])
    .then(function(data) {
      console.log('Search by "Love"', data);
    }, function(err) {
      console.error(err);
    });
    /*var uri = this.state.getTrack.newTrack
		spotifyApi.addTracksToPlaylist(snId, uri)
			.then((response) => {
				this.setState( {
					snId: response.snapshot_id
				});
			})*/
  }

  addTracksCallBack(error, value) {
    console.log("error" + error);
    console.log("track added... " + value);
  }

  //gets the snid so it can remove tracks
  getSNIDtoremoveTracks(trackURI) {
    trackToggle =trackURI;
    var playlistID = this.getUrlParams2("playlist_id");
    //this.getPlaylistHelper(playlistID)
    spotifyApi.getPlaylist(playlistID, this.SNIDtoRemoveCallback );
  }

  //callback to getPlaylist for the snid. it takes the snid and then actually tries to remove the song now
  SNIDtoRemoveCallback(error, value) {
    var snid = value.snapshot_id;
    console.log("snid: " + snid);
    //var position = tracks.indexOf() can add in later
    var playlistID = hereIsThis.getUrlParams2("playlist_id");
    spotifyApi.removeTracksFromPlaylistWithSnapshotId(playlistID,[trackToggle], snid, hereIsThis.removeTrackWithSnidCallback);
  }

  removeTrackWithSnidCallback(error, value) {
    console.log("well...that song should be removed:" + value.name);
    var playlistID = hereIsThis.getUrlParams2("playlist_id");
    hereIsThis.getPlaylistHelper(playlistID)
    //hereIsThis.forceUpdate();
    window.location.reload();
  }

  //i dont think I need this function
	removeTracks(snId) {
    var playlistID = this.getUrlParams2("playlist_id");
    //spotifyApi.getPlaylist(playlistID, {snapshot_id},
    var uri;
		spotifyApi.removeTracksFromPlaylistWithSnapshotId(snId, uri)
			.then((response) => {
				this.setState( {
					snId: response.snapshot_id
				});
			})
  }
  searchHelper(value){
    console.log("in search helper");
    //console.log("search results: " + items);
    var i =0;
    //console.log("error: " + error);
    console.log("value: " + typeof value);
    console.log("total: " + value.total);
    for(i=0; i<value.total; i++) {
      searchTracks.push(value.items[i].track); //name of the track
      console.log("track: " + tracks[i]);
      //console.log("track " + i + value.items[i].track.name);
    }  //
    //var i = items;
    listSearchTracks = searchTracks.map((searchTracks) =>
      <li><button id= {searchTracks.uri} onClick={e => hereIsThis.addTracks(e.target.id)} class="btn btn-success">-</button>{i.name}</li>
    );
    this.openModal();
  }

  search() {
    console.log("in search");
    var x = document.getElementById("searcht");
    var query = '';
    query = x.elements[0].value;
    console.log("query: " + query);
    var token = this.getUrlParams2("access_token");
    spotifyApi.setAccessToken(token);
    var alsoThis = this;
	//	var token = this.getUrlParams2("access_token");
        /*fetch('https://api.spotify.com/v1/search?q={query}&type=track}', {headers: {'Authorization':'Bearer ' + token}})
            .then(response => response.json())
            .then(data => this.searchHelper(data.items));
        spotifyApi.setAccessToken(token);*/

        /*fetch('https://api.spotify.com/v1/search', {headers: {'Authorization':'Bearer ' + token}})
            .then(response => response.json())
            .then(data => spotifyApi.searchTracks('Mr. Brightside', this.searchHelper));*/
  spotifyApi.searchTracks('Love')
  .then(function(data) {
    console.log('Search by "Love"', data);
  }, function(err) {
    console.error(err);
  });
    spotifyApi.searchTracks(query) .then(function(data) {
      var i=0;
      console.log("total: " + data.tracks.total);
    for(i=0; i<20; i++) {
      console.log("func call " + i);
      searchTracks.push(data.tracks.items[i]); //name of the track
      console.log("track: " + data.tracks.items[i].name);
      //console.log("track " + i + value.items[i].track.name);
    }  //
    //var i = items;
    listSearchTracks = searchTracks.map((searchTracks) =>
      <li><button id= {searchTracks.uri} onClick={e => alsoThis.addTracks(e.target.id)} class="btn btn-success">+</button>{searchTracks.name} by {searchTracks.artists[0].name}</li>
    );
    console.log("everything added in search");
    alsoThis.openModal();
    }, function(err) {
      console.error(err);
    });
    console.log("leaving search");
}



    // Display our data
    render() {
      //mainid = this.props.id;
      var alsoThis = this;
      console.log("im in render: ");
        return (
          <div id="app" className="App">
            <h1 class="cover-heading">DJFY</h1>
            <div class="row">
              <Modal

                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                style="overflow-y: scroll; background: #282c34;"
                contentLabel="Example Modal">
                <button class="pull-right btn btn-sm btn-primary" onClick={this.closeModal}>close</button>
                {/*<h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>*/}
                {listSearchTracks} {console.log("search listed")}

              </Modal>
              <div class="create col-sm-12">
                Spotify Account: {this.state.spotifyAccount.accountName}
                <img  src={this.state.spotifyAccount.accountPic} style={{ height: 100 }}/>
                {/*user id: {this.state.spotifyAccount.Id}*/}
                <br /> <br /> {/* Show button to check spotify account */}
                  {
                this.state.loggedIn &&
                <button class="btn btn-sm btn-primary" onClick={() => this.getConnectedAccount()}>
                    ShowAccount
                </button>
                  }
                <p>Connect to Spotify &nbsp;</p>
                <a href="https://djfy-backend-server.herokuapp.com/login" class="btn btn-lg btn-secondary">Connect</a>
                <form id="createroom">
                      <p class="lead">
                        <a>NAME PLAYLIST:</a>
                      </p>
                      <input  type = 'text' onChange={this.handleChange} />
                </form>
                <p class="lead">
                  <a id="YOUR_ID" className={this.state.isCreated ? 'box focused' : 'box'}  onClick={() => this.createRoom()} class="btn btn-lg btn-secondary">{/*React.cloneElement(alsoThis.props.children, {
                    onClick: _ => this.setState({isCreated: true}),})*/}CREATE ROOM</a>
                </p>
              </div>
            </div> {/* Closing div for first row */}
            <div class="row">
              <div class="room col-sm-12">
                <ul>
                <h2>{this.state.playlistName}</h2>
                <form id ="searcht">
                  <label>

                    <input  type = 'text' />
                  </label>
                  {/*<input onClick={() => this.search} value="Search" />*/}

                </form>
                <p class="lead">
                  <a id="" onClick={() => this.search()} class="btn btn-lg btn-secondary">SEARCH</a>
                </p>
                      <br/> <br/>
                      {listTracks} {console.log("listed")}
                </ul>
              </div>
            </div>
          </div>
        );
    }
}


export default App;
