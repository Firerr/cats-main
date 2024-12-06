import type { NextApiRequest, NextApiResponse } from "next";

import { updateCat, removeCat } from '@/lib/server/controllers/cats.controller'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return updateCat(req, res);
    case "DELETE":
      return removeCat(req, res);
    default:
      res.status(400).send(`Method ${req.method} not supported for ${new URL(req.url!).pathname}`);
  }
}
