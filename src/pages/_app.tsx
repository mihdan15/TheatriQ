import type { AppProps } from "next/app";

import "../styles/globals.scss";
import Layout from "../components/Layout";
import MoviesContext from "../context/ShowsContext";
import { useState } from "react";
import { Show } from "../constants/models/Shows";
import { shows as mockShows } from "../constants/shows";

function MyApp({ Component, pageProps }: AppProps) {
  const [shows, setShows] = useState<Show[]>(mockShows);
  return (
    <Layout>
      <MoviesContext.Provider value={{ shows, setShows }}>
        <Component {...pageProps} />
      </MoviesContext.Provider>
    </Layout>
  );
}

export default MyApp;
