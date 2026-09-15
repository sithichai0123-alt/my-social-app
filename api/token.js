import { AccessToken } from 'livekit-server-sdk';

export default async function handler(req, res) {
  const { room, username } = req.query;
  if (!room || !username) {
    return res.status(400).json({ error: 'room and username required' });
  }
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: username, ttl: '10h' }
  );
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });
  const token = await at.toJwt();
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ token, url: process.env.LIVEKIT_URL });
}
