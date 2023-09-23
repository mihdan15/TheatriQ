import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

import { Show, Seats } from "../../constants/models/Shows";
import styles from "./Payment.module.scss";
import ShowsContext from "../../context/ShowsContext";

import QRCode from "qrcode.react";

const Tickets = () => {
  const { shows, setShows } = useContext(ShowsContext);
  const router = useRouter();
  const [seconds, setSeconds] = useState(10);
  const [isTimerCompleted, setIsTimerCompleted] = useState(false);

  const [uniqueCode, setUniqueCode] = useState(""); // state untuk kode unik
  const [showQRCode, setShowQRCode] = useState(false); // state untuk menampilkan QR Code

  let showSeatDetails: Seats = {};
  let bookingChargePerTicket = 0.1,
    ticketCost: number,
    bookingFee: number,
    totalCost: number;
  const { showId, seatDetails }: any = router.query;
  const show = shows.find((sho) => sho.id === parseInt(showId));
  if (seatDetails) {
    showSeatDetails = JSON.parse(seatDetails);
  }

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsTimerCompleted(true);
    }
  });

  const computeSelectedSeats = () => {
    let selectedSeats: string[] = [];
    for (let key in showSeatDetails) {
      showSeatDetails[key].forEach((seatValue, seatIndex) => {
        if (seatValue === 2) {
          selectedSeats.push(`${key}${seatIndex + 1}`);
        }
      });
    }
    return selectedSeats;
  };

  const RenderSeatDetails = ({
    selectedSeats,
  }: {
    selectedSeats: string[];
  }) => {
    ticketCost = selectedSeats.length * (show?.ticketCost || 0);
    return (
      <div className={styles.seatDetailsContainer}>
        <div className={styles.seatDetails}>
          {selectedSeats.join(", ")} ({selectedSeats.length} Tickets)
        </div>
        <div className={styles.seatCost}>Rp.{ticketCost}</div>
      </div>
    );
  };

  const RenderBookingCharge = ({
    selectedSeats,
  }: {
    selectedSeats: string[];
  }) => {
    bookingFee =
      selectedSeats.length * (show?.ticketCost || 0) * bookingChargePerTicket;
    return (
      <div className={styles.seatDetailsContainer}>
        <div className={styles.seatDetails}>Booking Charge</div>
        <div className={styles.seatCost}>Rp.{bookingFee}</div>
      </div>
    );
  };

  const RenderTotalCharge = ({
    selectedSeats,
  }: {
    selectedSeats: string[];
  }) => {
    totalCost = ticketCost + bookingFee;
    return (
      <div className={styles.seatDetailsContainer}>
        <div className={styles.seatDetails}>Total</div>
        <div className={styles.seatCost}>Rp.{totalCost}</div>
      </div>
    );
  };

  const modifiedSeatValue = () => {
    let newShowSeatDetails = { ...showSeatDetails };
    for (let key in showSeatDetails) {
      showSeatDetails[key].forEach((seatValue, seatIndex) => {
        if (seatValue === 2) {
          showSeatDetails[key][seatIndex] = 1;
        }
      });
    }
    return newShowSeatDetails;
  };

  const generateUniqueCode = () => {
    // contoh sederhana untuk menghasilkan kode unik dengan 8 karakter
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const onConfirmButtonClick = async () => {
    let showIndex = shows.findIndex((sho) => sho.id === parseInt(showId));
    if (showIndex !== -1 && setShows) {
      shows[showIndex].seats = modifiedSeatValue();
      console.log(shows);

      // Simpan ke localStorage
      localStorage.setItem(
        `show-${show?.id}-seats`,
        JSON.stringify(shows[showIndex].seats)
      );
      setShows(shows);
      // router.push("/");
      // router.push("/");

      const code = generateUniqueCode();
      setUniqueCode(code); // set kode unik
      setShowQRCode(true);
    }
  };

  const RenderConfirmButton = () => {
    return (
      <div className={styles.paymentButtonContainer}>
        <Button
          variant="contained"
          disabled={isTimerCompleted}
          className={styles.paymentButton}
          onClick={onConfirmButtonClick}
        >
          {isTimerCompleted
            ? "Confirm Booking"
            : `Confirm Booking (${seconds})`}
        </Button>
      </div>
    );
  };

  const RenderQRCode = () => (
    <div className={styles.card}>
      <div className={styles.cardTitleContainer}>
        <div className={styles.cardTitle}>BOOKING CONFIRMED</div>
      </div>
      <p className={styles.codeBook}>{uniqueCode}</p>
      <QRCode value={uniqueCode} size={256} />
      <div className={styles.paymentButtonContainer}>
        <Button
          variant="contained"
          className={styles.paymentButton}
          onClick={() => router.push("/")}
        >
          Okay
        </Button>
      </div>
    </div>
  );

  const RenderCard = () => {
    if (showQRCode) {
      return <RenderQRCode />;
    }
    let selectedSeats: string[] = computeSelectedSeats();

    if (!show) return <div>loading...</div>;
    return (
      <div className={styles.card}>
        <div className={styles.cardTitleContainer}>
          <Link
            href={{
              pathname: `/seats/${show?.id}`,
              query: {
                seats: isTimerCompleted ? null : JSON.stringify(seatDetails),
              },
            }}
          >
            <ArrowBackIcon />
          </Link>
          <div className={styles.cardTitle}>BOOKING SUMMARY</div>
        </div>
        <p className={styles.showName}>{show.name}</p>
        <RenderSeatDetails selectedSeats={selectedSeats} />
        <RenderBookingCharge selectedSeats={selectedSeats} />
        <hr className={styles.hrStyle} />
        <RenderTotalCharge selectedSeats={selectedSeats} />
        <RenderConfirmButton />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Payment Page</title>
      </Head>
      <div className={styles.container}>
        <RenderCard />
      </div>
    </>
  );
};

type ShowType = {
  show: Show;
  isLoading: boolean;
  isError: boolean;
};

export default Tickets;
