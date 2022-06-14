import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../services/userAPI';
import Carregando from '../Carregando';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      carregando: true,
    };
  }

  async componentDidMount() {
    const user = await getUser();
    this.setState({ username: user.name }, () => {
      this.setState({ carregando: false });
    });
  }

  render() {
    const { username, carregando } = this.state;

    return (
      <header data-testid="header-component">
        { carregando ? <Carregando /> : (
          <>
            <h1>Header</h1>
            <h3 data-testid="header-user-name">{username}</h3>
            <Link data-testid="link-to-search" to="/search">Search</Link>
            <Link data-testid="link-to-favorites" to="/favorites">Favorites</Link>
            <Link data-testid="link-to-profile" to="/profile">Profile</Link>
          </>
        ) }
      </header>
    );
  }
}

export default Header;
