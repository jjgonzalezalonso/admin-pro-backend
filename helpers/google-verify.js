
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

async function googleVerify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_ID,  
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];

  //const { name, email, picture } = payload;
  //console.log({payload});
  return payload;
}

module.exports={
    googleVerify
}
