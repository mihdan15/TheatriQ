import { Grid, Button } from "@mui/material";
import Head from "next/head";
import Link from "next/link";

import styles from "../styles/Home.module.scss";
import { useGetShows } from "../services/shows";
import { Show } from "../constants/models/Shows";
import Seats from "../pages/seats/[id]";

export default function Home() {
  const { shows, isLoading, isError } = useGetShows();

  const calculateAvailableSeats = (showId: number) => {
    const savedSeats = localStorage.getItem(`show-${showId}-seats`);
    if (savedSeats) {
      const seats: Seats = JSON.parse(savedSeats);
      let count = 0;
      for (let key in seats) {
        count += seats[key].filter(
          (seatValue: number) => seatValue === 0
        ).length;
      }
      return count;
    }
    return 140; // Nilai default jika tidak ditemukan di localStorage
  };

  const RenderShowsList = () => {
    if (shows) {
      return shows.map((show: Show) => {
        const availableSeats = calculateAvailableSeats(show.id);
        return (
          <Grid item xs={4} key={show.id}>
            <Link href={`/details/${show.id}`}>
              <div className={styles.card}>
                <div className={styles.movieTitle}> {show.name} </div>
                <div className={styles.movieLanguage}> {show.language} </div>
                <div className={styles.movieLanguage}>
                  {" "}
                  Harga : {show.ticketCost}{" "}
                </div>
                <div className={styles.availableSeatsInfo}>
                  Sisa Kursi: {availableSeats}
                </div>
              </div>
            </Link>
          </Grid>
        );
      });
    } else if (isLoading) {
      return <>Loading Shows...</>;
    } else {
      return <>No Shows To Watch...</>;
    }
  };

  return (
    <>
      <Head>
        <title>TheatriQ | Home</title>
      </Head>
      <div className={styles.moviesContainer}>
        <h1 className={styles.title}>Teater Terpilih Untuk Pecinta Seni</h1>
        <Grid container spacing={2}>
          <RenderShowsList />
        </Grid>
      </div>
    </>
  );
}
