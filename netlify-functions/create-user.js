const fetch = require('node-fetch');

const unauthorized = {
  statusCode: 401,
  body: JSON.stringify({ message: 'Unauthorized' }),
};

exports.handler = async (event, context) => {
  console.log(
    'Create user input:',
    JSON.stringify({ event, context }, null, 2),
  );

  const { authorization } = event.headers;
  if (!authorization) {
    return unauthorized;
  }

  const { identity } = context.clientContext;
  const siteUrl = identity.url.split('/.netlify/identity')[0];

  // authorization check based on Netlify API Token
  const sites = await fetch('https://api.netlify.com/api/v1/sites/', {
    headers: {
      authorization,
    },
  });
  console.log('Create user sites:', JSON.stringify(sites, null, 2));
  const site = sites.find(site => site.ssl_url === siteUrl);
  if (!site) {
    return unauthorized;
  }

  try {
    // create user
    const usersUrl = `${identity.url}/admin/users`;
    const adminAuthHeader = 'Bearer ' + identity.token;
    const { email, password } = JSON.parse(event.body);

    return fetch(usersUrl, {
      method: 'POST',
      headers: { Authorization: adminAuthHeader },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log('Created a user! 204!');
        return { statusCode: 204, body: JSON.stringify(data) };
      });
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unknown error' }),
    };
  }
};
