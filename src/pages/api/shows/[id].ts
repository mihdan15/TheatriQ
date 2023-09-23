import type { NextApiRequest, NextApiResponse } from "next";

import { Show } from "../../../constants/models/Shows";
import { shows } from "../../../constants/shows";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Show | undefined>
) {
  const { id } = req.query;

  if (req.method === "GET") {
    if (typeof id === "string") {
      const show = shows.find((show) => show.id === parseInt(id));
      res.status(200).json(show);
    }
  } else if (req.method === "PUT") {
    if (typeof id === "string") {
      const showIndex = shows.findIndex((show) => show.id === parseInt(id));
      shows[showIndex].seats = req.body.seatDetails;
      res.status(200).json(shows[showIndex]);
    }
  }
}
