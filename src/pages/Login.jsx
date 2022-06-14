import React from 'react';
import propTypes from 'prop-types';
import Carregando from '../Carregando';
import { createUser } from '../services/userAPI';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      carregando: false,
      minNumber: 3,
      username: '',
      buttonState: true,
    };

    this.activateButton = this.activateButton.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.setState({ carregando: true }, async () => {
      const { username } = this.state;
      const { history } = this.props;
      await createUser({ name: username });
      history.push('/search');
    });
  }

  activateButton({ target }) {
    const { minNumber } = this.state;
    const value = target.value ? target.value.length : 0;
    const buttonState = value < minNumber;
    this.setState({ buttonState, username: target.value });
  }

  render() {
    const { buttonState, username, carregando } = this.state;

    return (
      <div className="login" data-testid="page-login">
        { carregando ? (<Carregando />) : (
          <>
            <h1>Login</h1>
            <form>
              <input
                onChange={ this.activateButton }
                data-testid="login-name-input"
                type="text"
                value={ username }
                placeholder="username"
              />
              <button
                data-testid="login-submit-button"
                type="button"
                disabled={ buttonState }
                onClick={ this.handleSubmit }
              >
                Login
              </button>
            </form>
          </>
        ) }
      </div>
    );
  }
}

Login.propTypes = {
  history: propTypes.shape({ push: propTypes.func.isRequired }).isRequired,
};

export default Login;
