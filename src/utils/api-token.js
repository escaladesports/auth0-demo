import axios from 'axios';

const generateToken = () => {
  const headers = {
    'content-type': 'application/json'
  };
  const body = {
    grant_type: 'client_credentials',
    client_id: 'OOo0GXvDetld_2BQ7fOAP5B3KfPMdWMi',
    client_secret:
      'uReQkEtX__5pvdml-Jqa4vLWD0pMl1A9Ih8FUlKlqUzmnpiWCc8OvMn5utG0XhZw',
    audience: 'https://taustin.auth0.com/api/v2/'
  };
  return new Promise((resolve, reject) => {
    axios
      .post('https://taustin.auth0.com/oauth/token', body, headers)
      .then(res => {
        resolve(res.data.access_token);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export { generateToken };
