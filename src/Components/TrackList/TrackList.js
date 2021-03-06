import React from 'react';
import './TrackList.css'
import Track from '../Track/Track.js';

class TrackList extends React.Component {


    
    render() {
        console.log(this.props.tracks);
        return (
            <div className="TrackList">
                {this.props.tracks.map(track => (
                <Track 
                    track={track} 
                    key={track.id} 
                    onAdd={this.props.onAdd} 
                    isRemoval={this.props.isRemoval}
                    onRemove={this.props.onRemove} 
                    />
                    )
                )
                }
                
            </div>
        )
    }
}

TrackList.defaultProps = {
    tracks: []
}
export default TrackList;