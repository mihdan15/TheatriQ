import React from "react";
import { Show } from "../constants/models/Shows";
import { shows } from "../constants/shows";

export default React.createContext<ShowContextModal>({ shows: shows });

interface ShowContextModal {
  shows: Show[];
  setShows?: Function;
}
