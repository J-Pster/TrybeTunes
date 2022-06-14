import React from 'react';
import propTypes from 'prop-types';
import getMusics from '../services/musicsAPI';
import Header from '../components/Header';
import Carregando from '../Carregando';
import MusicCard from '../components/MusicCard';

class Album extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      musics: [],
      carregando: true,
    };

    this.requestMusics = this.requestMusics.bind(this);
  }

  componentDidMount() {
    this.requestMusics();
  }

  async requestMusics() {
    const { match } = this.props;
    const response = await getMusics(match.params.id);
    this.setState({ musics: response }, () => { this.setState({ carregando: false }); });
  }

  render() {
    const { musics, carregando } = this.state;

    return (
      <>
        <Header />
        <div className="Album" data-testid="page-album">
          {carregando ? (<Carregando />) : (
            <>
              <h1>Album</h1>
              <div>
                <div>
                  <img src={ musics[0].artworkUrl100 } alt={ musics[0].artistName } />
                  <h2 data-testid="artist-name">{musics[0].artistName}</h2>
                  <h3 data-testid="album-name">{musics[0].collectionName}</h3>
                  {
                    musics.map((music, index) => (
                      <MusicCard
                        key={ index }
                        name={ music.trackName }
                        previewUrl={ music.previewUrl }
                        type={ music.kind }
                        trackId={ music.trackId }
                      />
                    ))
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

Album.propTypes = {
  match: propTypes.shape(
    { params: propTypes.shape(
      { id: propTypes.string,
      },
    ),
    },
  ).isRequired,
};

export default Album;
