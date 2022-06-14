import React from 'react';
import propTypes from 'prop-types';
import { addSong, getFavoriteSongs, removeSong } from '../services/favoriteSongsAPI';
import Carregando from '../Carregando';

class MusicCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      carregando: false,
      isFavourite: false,
    };

    this.favouriteSong = this.favouriteSong.bind(this);
    this.verifyIfIsFavourite = this.verifyIfIsFavourite.bind(this);
  }

  componentDidMount() {
    this.verifyIfIsFavourite();
  }

  verifyIfIsFavourite() {
    const { trackId } = this.props;
    const { carregando } = this.state;

    if (carregando) return;

    this.setState({ carregando: true }, async () => {
      const response = await getFavoriteSongs();
      const isFavourite = response.some((song) => song.trackId === trackId);

      this.setState({ carregando: false, isFavourite });
    });
  }

  favouriteSong() {
    const { name, previewUrl, type, trackId } = this.props;
    const { carregando, isFavourite } = this.state;

    if (carregando) return;

    this.setState({ carregando: true }, async () => {
      if (isFavourite) {
        await removeSong({ name, previewUrl, type, trackId });
        this.setState({ carregando: false, isFavourite: false });
      } else {
        await addSong({ name, previewUrl, type, trackId });
        this.setState({ carregando: false, isFavourite: true });
      }
    });
  }

  render() {
    const { name, previewUrl, type, trackId } = this.props;
    const { carregando, isFavourite } = this.state;

    return (
      <div className="musicCard">
        {type === 'song' ? (
          <div className="musicContent">
            {carregando ? (<Carregando />) : (
              <>
                <p className="nome">{name}</p>
                <audio data-testid="audio-component" src={ previewUrl } controls>
                  <track kind="captions" />
                  O seu navegador não suporta o elemento
                  {' '}
                  <code>audio</code>
                  .
                </audio>
                <input
                  data-testid={ `checkbox-music-${trackId}` }
                  type="checkbox"
                  onChange={ this.favouriteSong }
                  checked={ isFavourite }
                />
              </>
            )}
          </div>
        ) : null }
      </div>
    );
  }
}

MusicCard.propTypes = {
  name: propTypes.string,
  previewUrl: propTypes.string,
  type: propTypes.string,
  trackId: propTypes.oneOfType([
    propTypes.string,
    propTypes.number,
  ]),
};

MusicCard.defaultProps = {
  name: 'Music',
  previewUrl: 'MusicLink',
  type: 'another',
  trackId: '0',
};

export default MusicCard;
