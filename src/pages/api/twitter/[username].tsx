import type { NextApiRequest, NextApiResponse } from 'next'

const TWITTER_API = process.env.NEXT_PUBLIC_TWITTER_API

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const username = req.query.username;

  if (!TWITTER_API) {
    res.status(500).json({error: "Twitter API not provided."})
  }


  if (!username) {
    res.status(500).json({error: "Username not provided."})
  }

  const endpoint = `${TWITTER_API}${username}`;

  await fetch(endpoint)
    .then((res) => res.json())
    .then((json) => {
      if (json.error) throw new Error(json.error)
      res.status(200).json(json)
    })
    .catch((err) => res.status(500).json({ error: err }))
}
