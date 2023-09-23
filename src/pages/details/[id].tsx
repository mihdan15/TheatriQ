import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

import { Show } from "../../constants/models/Shows";
import styles from "./Details.module.scss";
import ShowsContext from "../../context/ShowsContext";
import { useContext } from "react";

const Details = () => {
  const { shows } = useContext(ShowsContext);
  const router = useRouter();
  const { id }: any = router.query;
  const show = shows.find((mov) => mov.id === parseInt(id));

  const RenderBookTicketsButton = () => {
    return (
      <Link href={`/seats/${show?.id}`}>
        <div className={styles.paymentButtonContainer}>
          <Button
            variant="contained"
            href="#contained-buttons"
            className={styles.paymentButton}
          >
            Book Ticket
          </Button>
        </div>
      </Link>
    );
  };

  const RenderCustomizeRowsButton = () => {
    return (
      <Link href={`/customize/${show?.id}`}>
        <div className={styles.paymentButtonContainer}>
          <Button
            variant="contained"
            href="#contained-buttons"
            className={styles.paymentButton}
          >
            Customize Row
          </Button>
        </div>
      </Link>
    );
  };

  if (!show) return <div>loading...</div>;
  return (
    <>
      <Head>
        <title>Details</title>
      </Head>
      <div className={styles.seatsContainer}>
        <h1>
          {show.name} - {show.language}
        </h1>
        <div className={styles.language}>Ticket Cost: {show.ticketCost}</div>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonHolder}>
            <RenderBookTicketsButton />
            <RenderCustomizeRowsButton />
          </div>
        </div>
      </div>
    </>
  );
};

type ShowType = {
  show: Show;
  isLoading: boolean;
  isError: boolean;
};

export default Details;
