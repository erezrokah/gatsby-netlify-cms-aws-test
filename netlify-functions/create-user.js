import fetch from 'node-fetch';

exports.handler = async (event, context) => {
  const { identity } = context.clientContext;
  const usersUrl = `${identity.url}/admin/users`;
  const adminAuthHeader = 'Bearer ' + identity.token;

  try {
    return fetch(usersUrl, {
      method: 'POST',
      headers: { Authorization: adminAuthHeader },
      body: JSON.stringify({
        email: 'test-email@test.com',
        password: 'test-email',
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log('Created a user! 204!');
        console.log(JSON.stringify({ data, event }));
        return { statusCode: 204 };
      });
  } catch (e) {
    return e;
  }
};
