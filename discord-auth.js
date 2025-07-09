
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
  params.append('redirect_uri', 'https://zorynweb.vercel.app/api/discord-auth');
  params.append('code', code);

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const tokenData = await tokenRes.json();
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`
      }
    });
    const user = await userRes.json();
    const redirect = `/welcome.html?username=${user.username}&discriminator=${user.discriminator}&id=${user.id}&avatar=${user.avatar}`;
    return res.redirect(redirect);
  } catch (err) {
    return res.status(500).send('OAuth Error');
  }
};
