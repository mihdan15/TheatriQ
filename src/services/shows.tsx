import axios from "axios";
import useSWR from "swr";
import { Seats } from "../constants/models/Shows";

function useGetShows() {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(`/api/shows`, fetcher);

  return {
    shows: data,
    isLoading: !error && !data,
    isError: error,
  };
}

function useGetShowById(id: string) {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(`/api/shows/${id}`, fetcher);

  return {
    show: data,
    isLoading: !error && !data,
    isError: error,
  };
}

async function useBookTicketByShowId(id: string, seatDetails: Seats) {
  return await axios.put(`/api/shows/${id}`, { seatDetails });
}

export { useGetShows, useGetShowById, useBookTicketByShowId };
