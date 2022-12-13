import type { NextApiRequest, NextApiResponse } from 'next'

const TWITTER_API = process.env.NEXT_PUBLIC_TWITTER_API

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const address = req.query.address;

  if (!TWITTER_API) {
    res.status(500).json({error: "Twitter API not provided."})
  }


  if (!address) {
    res.status(500).json({error: "Wallet address not provided."})
  }

  const endpoint = `${TWITTER_API}update/${address}`;

  await fetch(endpoint, { method: "PATCH" })
    .then((res) => res.json())
    .then((json) => {
      if (json.error) throw new Error(json.error)
      res.status(200).json(json)
    })
    .catch((err) => res.status(500).json({ error: err }))
}
