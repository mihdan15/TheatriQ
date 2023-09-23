import type { NextApiRequest, NextApiResponse } from "next";

import { Show } from "../../../constants/models/Shows";
import { shows } from "../../../constants/shows";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Show[]>
) {
  if (req.method === "GET") {
    res.status(200).json(shows);
  }
}
