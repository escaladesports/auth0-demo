import React, { Component } from 'react';
import axios from 'axios';

import { generateToken } from './utils/api-token';
import lock from './lock';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,
      err: null,
      items: {},
      token: null
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.addItem = this.addItem.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  resetPassword() {
    const body = {
      client_id: 'OOo0GXvDetld_2BQ7fOAP5B3KfPMdWMi',
      email: this.state.profile.email,
      connection: 'Username-Password-Authentication'
    };
    axios
      .post(`https://taustin.auth0.com/dbconnections/change_password`, body)
      .then(res => {
        alert(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  addItem() {
    this.setState({
      items: {
        ...this.state.items,
        [this.keyInput.value]: this.valueInput.value
      }
    });

    this.keyInput.value = '';
    this.valueInput.value = '';
  }

  editProfile() {
    const headers = {
      Authorization: `Bearer ${this.state.token}`
    };

    axios
      .patch(
        `https://taustin.auth0.com/api/v2/users/${this.state.profile.user_id}`,
        { user_metadata: this.state.items },
        { headers }
      )
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        //patch request is failing here with 401
        console.log(err);
        this.setState({
          err: err.message
        });
      });
  }

  componentDidMount() {
    const { getProfile } = this.props.auth;
    let user = {};
    getProfile()
      .then(profile => {
        user = profile;
        return generateToken();
      })
      .then(token => {
        this.setState({
          token
        });
        const headers = { Authorization: `Bearer ${token}` };
        return axios.get(`https://taustin.auth0.com/api/v2/users/${user.sub}`, {
          headers
        });
      })
      .then(res => {
        this.setState({
          profile: res.data
        });
      })
      .catch(err => {
        this.setState({
          err: err.message
        });
      });
  }

  login() {
    lock.show();
    // this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
    this.setState({
      profile: null
    });
  }

  render() {
    const { isAuth } = this.props.auth;
    const { profile, err, items } = this.state;
    if (isAuth()) {
      if (!profile)
        return <div style={{ marginTop: '300px' }}>loading ...</div>;
    }

    return (
      <div style={{ textAlign: 'center' }}>
        {err ? <div>{err}</div> : null}
        {isAuth() ? (
          <div>
            <button
              style={{
                height: 'auto',
                width: '5em',
                background: 'teal',
                color: 'white',
                display: 'block',
                fontSize: '18px',
                margin: '5px auto'
              }}
              onClick={this.logout}
            >
              Logout
            </button>
            <button
              style={{
                height: 'auto',
                background: 'teal',
                color: 'white',
                display: 'block',
                fontSize: '18px',
                margin: '5px auto'
              }}
              onClick={this.resetPassword}
            >
              Reset Password
            </button>
            <h2>Edit Profile</h2>
            <input
              type="text"
              name="key"
              ref={input => {
                this.keyInput = input;
              }}
              placeholder="key"
            />{' '}
            <br />
            <br />
            <input
              type="text"
              name="value"
              ref={input => {
                this.valueInput = input;
              }}
              placeholder="value"
            />{' '}
            <br />
            <br />
            <button
              style={{
                height: 'auto',
                width: '5em',
                background: 'teal',
                color: 'white',
                display: 'block',
                fontSize: '18px',
                margin: '5px auto'
              }}
              onClick={this.addItem}
            >
              Add
            </button>
            <button
              style={{
                height: 'auto',
                width: '5em',
                background: 'teal',
                color: 'white',
                display: 'block',
                fontSize: '18px',
                margin: '5px auto'
              }}
              onClick={this.editProfile}
            >
              Submit
            </button>
            <div>
              <h1>Keys</h1>
              {Object.keys(items).map(key => {
                return <div key={key}>{key}</div>;
              })}
            </div>
            <div>
              <h1>Values</h1>
              {Object.values(items).map(value => {
                return <div key={value}>{value}</div>;
              })}
            </div>
            <div>
              <h1>{profile.name}</h1>
              <img src={profile.picture} alt="" />
              {profile.user_metadata ? (
                <div>
                  <h3>{profile.user_metadata.address}</h3>
                  <h3>{profile.user_metadata.city}</h3>
                  <h3>{profile.user_metadata.state}</h3>
                  <h3>{profile.user_metadata.product_info}</h3>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <button
            style={{
              height: 'auto',
              width: '5em',
              background: 'teal',
              color: 'white',
              fontSize: '18px'
            }}
            onClick={this.login}
          >
            Login
          </button>
        )}
      </div>
    );
  }
}

export default App;
