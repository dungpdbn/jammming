import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import  Playlist  from '../PlayList/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'aaaa',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    let tracksId = this.state.playlistTracks.map(trackId => trackId.id);
    if (!tracksId.includes(track.id)) {
      tracks.push(track);
      this.setState({ 
        playlistTracks: tracks
      });
    }
  }

  removeTrack(removedTrack) {
    let tracks = this.state.playlistTracks.filter(track => track.id !== removedTrack.id);
    this.setState({ playlistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    let trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
     }))
  }

  search(term) {
    Spotify.search(term).then(result => {
      this.setState({ searchResults: result })
    })
  }

  componentDidMount() {
    window.addEventListener('load', Spotify.search(''));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">

          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack} 
            />
            <Playlist 
              onNameChange={this.updatePlaylistName}
              onRemove={this.removeTrack} 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
  
}

export default App;
