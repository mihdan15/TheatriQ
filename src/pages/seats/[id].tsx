import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material";

import { Show, Seats } from "../../constants/models/Shows";
import styles from "./Seats.module.scss";
import ShowsContext from "../../context/ShowsContext";

const Seats = () => {
  const { shows } = useContext(ShowsContext);
  const router = useRouter();
  let selectedSeats: string[] = [];
  const { id, seats }: any = router.query;
  const show = shows.find((sho) => sho.id === parseInt(id));

  const storedSeatDetails = localStorage.getItem(`show-${show?.id}-seats`);
  const initialSeats = storedSeatDetails
    ? JSON.parse(storedSeatDetails)
    : show?.seats || {};
  const [seatDetails, setSeatDetails] = useState<Seats>(initialSeats);
  // const [seatDetails, setSeatDetails] = useState<Seats>(show?.seats || {});

  useEffect(() => {
    if (!seats) {
      clearSelectedSeats();
    }
  }, []);

  const clearSelectedSeats = () => {
    let newShowSeatDetails = { ...seatDetails };
    for (let key in seatDetails) {
      seatDetails[key].forEach((seatValue, seatIndex) => {
        if (seatValue === 2) {
          seatDetails[key][seatIndex] = 0;
        }
      });
    }
    setSeatDetails(newShowSeatDetails);
  };

  const onSeatClick = (seatValue: number, rowIndex: number, key: string) => {
    const updatedSeatDetails = { ...seatDetails };

    if (updatedSeatDetails[key]) {
      if (seatValue === 1 || seatValue === 3) {
        return;
      } else if (seatValue === 0) {
        updatedSeatDetails[key][rowIndex] = 2;
      } else {
        updatedSeatDetails[key][rowIndex] = 0;
      }
    }

    setSeatDetails(updatedSeatDetails);

    // Setelah pembaruan state, kita menyimpannya ke localStorage.
    localStorage.setItem(
      `show-${show?.id}-seats`,
      JSON.stringify(updatedSeatDetails)
    );

    // if (seatDetails) {
    //   if (seatValue === 1 || seatValue === 3) {
    //     return;
    //   } else if (seatValue === 0) {
    //     seatDetails[key][rowIndex] = 2;
    //   } else {
    //     seatDetails[key][rowIndex] = 0;
    //   }
    //   localStorage.setItem(
    //     `show-${show?.id}-seats`,
    //     JSON.stringify(seatDetails)
    //   );
    // }
    // setSeatDetails({ ...seatDetails });

    // Simpan kursi yang dipilih ke localStorage
    // const selectedSeatsInfo: string[] = [];
    // for (let key in seatDetails) {
    //   seatDetails[key].forEach((value, index) => {
    //     if (value === 2) {
    //       // 2 menunjukkan kursi yang dipilih
    //       selectedSeatsInfo.push(`${key}${index + 1}`);
    //     }
    //   });
    // }
    // localStorage.setItem(
    //   `show-${show?.id}-selected-seats`,
    //   JSON.stringify(selectedSeatsInfo)
    // );
  };

  const calculateAvailableSeats = () => {
    let count = 0;
    for (let key in seatDetails) {
      count += seatDetails[key].filter((seatValue) => seatValue === 0).length;
    }
    return count;
  };

  /**
   * 0 - Not booked
   * 1 - Booked
   * 2 - Selected
   * 3 - Blocked
   */
  const getClassNameForSeats = (seatValue: number) => {
    let dynamicClass;
    if (seatValue === 0) {
      // Not booked
      dynamicClass = styles.seatNotBooked;
    } else if (seatValue === 1) {
      // booked
      dynamicClass = styles.seatBooked;
    } else if (seatValue === 2) {
      // Seat Selected
      dynamicClass = styles.seatSelected;
    } else {
      // Seat Blocked
      dynamicClass = styles.seatBlocked;
    }
    return `${styles.seats} ${dynamicClass}`;
  };

  const RenderSeats = () => {
    let seatArray = [];
    for (let key in seatDetails) {
      let colValue = seatDetails[key].map((seatValue, rowIndex) => (
        <span key={`${key}.${rowIndex}`} className={styles.seatsHolder}>
          {rowIndex === 0 && <span className={styles.colName}>{key}</span>}
          <span
            className={getClassNameForSeats(seatValue)}
            onClick={() => onSeatClick(seatValue, rowIndex, key)}
          >
            {rowIndex + 1}
          </span>
          {seatDetails && rowIndex === seatDetails[key].length - 1 && (
            <>
              <br />
              <br />
            </>
          )}
        </span>
      ));
      seatArray.push(colValue);
    }
    return <div className={styles.seatsLeafContainer}>{seatArray}</div>;
  };

  const RenderPaymentButton = () => {
    selectedSeats = [];
    for (let key in seatDetails) {
      seatDetails[key].forEach((seatValue, seatIndex) => {
        if (seatValue === 2) {
          selectedSeats.push(`${key}${seatIndex + 1}`);
        }
      });
    }
    if (selectedSeats.length) {
      return (
        <Link
          href={{
            pathname: "/payment",
            query: {
              showId: show?.id,
              seatDetails: JSON.stringify(seatDetails),
            },
          }}
        >
          <div className={styles.paymentButtonContainer}>
            <Button
              variant="contained"
              href="#contained-buttons"
              className={styles.paymentButton}
            >
              Bayar Rp.{selectedSeats.length * (show?.ticketCost || 0)}
            </Button>
          </div>
        </Link>
      );
    } else {
      return <></>;
    }
  };

  if (!show) return <div>loading...</div>;
  return (
    <>
      <Head>
        <title>Seats</title>
      </Head>
      <div className={styles.seatsContainer}>
        <h1>{show.name}</h1>
        <div className={styles.availableSeatsInfo}>
          Sisa Kursi: {calculateAvailableSeats()}
        </div>
        {seatDetails && <RenderSeats />}
        <RenderPaymentButton />
      </div>
    </>
  );
};

type ShowType = {
  show: Show;
  isLoading: boolean;
  isError: boolean;
};

export default Seats;
