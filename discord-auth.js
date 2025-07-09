
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('No code provided');
  }

  const params = new URLSearchParams();
  params.append('client_id', '1392276049601101906');
  params.append('client_secret', 'cqJ1fF-UU3nPvYlEs8foddGVqx4JtV3o');
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', 'https://zoryn.vercel.app/auth/discord/callback');
  params.append('code', code);

  try {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const data = await response.json();
    const userInfo = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${data.token_type} ${data.access_token}`,
      }
    });
    const user = await userInfo.json();
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).send('Error during Discord OAuth');
  }
};
