"use client";

import React, { useEffect, useState } from "react";
import styles from "./Acara.module.css";
import Link from "next/link";

type EventItem = {
  id_news: number;
  judul: string;
  tanggal: string;
  image: string;
};

const PAGE_SIZE = 5;

export default function AcaraPage() {
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch semua data event sekali
  useEffect(() => {
    async function fetchAllEvents() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/news?category=event`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();

        const eventData = json.data.data || [];
        setAllEvents(eventData);

        setTotalPages(Math.ceil(eventData.length / PAGE_SIZE));
      } catch (error) {
        console.error(error);
        setAllEvents([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    fetchAllEvents();
  }, []);

  // Hitung data event yang ditampilkan di halaman sekarang
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedEvents = allEvents.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className={styles.container}>
      <section className={styles.headerSection}>
        <h1>Acara Terbaru</h1>
        <p>Berikut ini adalah daftar acara dengan kategori event terbaru.</p>
      </section>

      <section className={styles.eventsSection}>
        {loading ? (
          <p>Loading...</p>
        ) : paginatedEvents.length === 0 ? (
          <p>Tidak ada acara ditemukan.</p>
        ) : (
            paginatedEvents.map((event) => (
            <Link
                key={event.id_news}
                href={`/aktivitas/acara/${event.id_news}`}
                className={styles.eventItem} // pindahkan ke Link
            >
                <div className={styles.left}>
                <img
                    src={`http://localhost:8000/storage/${event.image}`}
                    alt={event.judul}
                />
                </div>
                <div className={styles.right}>
                <h3>{event.judul}</h3>
                <p className={styles.date}>
                    {new Date(event.tanggal).toLocaleDateString()}
                </p>
                </div>
            </Link>
            ))
        )}
      </section>

      <section className={styles.paginationSection}>
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Sebelumnya
        </button>
        <span>
          Halaman {page} dari {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Selanjutnya
        </button>
      </section>
    </div>
  );
}
