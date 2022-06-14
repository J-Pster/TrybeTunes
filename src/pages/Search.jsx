import React from 'react';
import { Link } from 'react-router-dom';
import searchAlbumsAPI from '../services/searchAlbumsAPI';
import Carregando from '../Carregando';
import Header from '../components/Header';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      actualSearch: '',
      response: [],
      carregando: false,
      pesquisado: false,
      buttonActivate: true,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleInputChange({ target }) {
    const value = target.value ? target.value : '';
    const buttonState = value.length < 2;
    this.setState({ buttonActivate: buttonState, search: value });
  }

  handleButtonClick() {
    this.setState({ carregando: true, pesquisado: false }, () => {
      const { search } = this.state;
      this.setState({ actualSearch: search }, async () => {
        const { actualSearch } = this.state;
        this.setState({ search: '' });
        const response = await searchAlbumsAPI(actualSearch);
        this.setState({ response }, () => {
          this.setState({ carregando: false, pesquisado: true,
          });
        });
      });
    });
  }

  render() {
    const {
      search,
      buttonActivate,
      carregando,
      response,
      actualSearch,
      pesquisado,
    } = this.state;

    return (
      <div className="Search" data-testid="page-search">
        <Header />
        {carregando ? <Carregando /> : (
          <>
            <h1>Search</h1>
            <form>
              <input
                data-testid="search-artist-input"
                type="text"
                placeholder="Search"
                value={ search }
                onChange={ this.handleInputChange }
              />
              <button
                data-testid="search-artist-button"
                type="button"
                disabled={ buttonActivate }
                onClick={ this.handleButtonClick }
              >
                Pesquisar
              </button>
            </form>
          </>
        )}

        {pesquisado && (
          <div className="search-results">
            {response.length > 0 ? (
              <>
                <h2>
                  Resultado de álbuns de:
                  {' '}
                  { actualSearch }
                </h2>
                <div>
                  {response.map((album) => (
                    <div
                      className="album"
                      key={ album.collectionId }
                      id={ `${album.artistId}|${album.collectionId}` }
                    >
                      <div className="album-info">
                        <p>
                          Artista:
                          {' '}
                          { album.artistName }
                        </p>
                        <p>
                          Coleção:
                          {' '}
                          { album.collectionName }
                        </p>
                        <p>
                          Data de Lançamento:
                          {' '}
                          { album.releaseDate }
                        </p>
                      </div>
                      <p>
                        Valor:
                        {' '}
                        { album.collectionPrice }
                      </p>
                      <Link
                        data-testid={ `link-to-album-${album.collectionId}` }
                        to={ `/album/${album.collectionId}` }
                      >
                        Escutar
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <h2>Nenhum álbum foi encontrado</h2>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Search;
