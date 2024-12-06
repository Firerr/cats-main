import type { NextApiRequest, NextApiResponse } from "next";

import { getCats, addCat} from '@/lib/server/controllers/cats.controller'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getCats(req, res);
    case "POST":
      return addCat(req, res);
    default:
      res.status(400).send(`Method ${req.method} not supported for ${new URL(req.url!).pathname}`);
  }
}
