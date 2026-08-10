"use client";

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json());

export function useReports(filter: string) {
  const { data, error, isLoading } = useSWR(
    `/api/admin/reports?filter=${filter}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000,
      keepPreviousData: true,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
}