"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./AcaraDetail.module.css";
import Image from "next/image";

type EventDetail = {
  id_news: number;
  judul: string;
  sub_judul: string;
  tempat: string;
  tanggal: string;
  image: string;
  deskripsi: string;
};

function formatDateDMY(dateStr: string): string {
  const d = new Date(dateStr);
  const dd = d.getDate().toString().padStart(2, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function DetailAcaraPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`http://localhost:8000/api/news/${id}`);
        const json = await res.json();

        if (json.data.kategori !== "event") {
          setEvent(null);
        } else {
          setEvent(json.data);
        }
      } catch (error) {
        console.error(error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDetail();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>Acara tidak ditemukan atau bukan kategori event.</p>;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.container}>
          <section className={styles.imageSection}>
            <Image
              src={`http://localhost:8000/storage/${event.image}`}
              alt={event.judul}
              width={600}    // sesuaikan ukuran yang diinginkan
              height={400}   // sesuaikan ukuran yang diinginkan
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
          </section>

          <section className={styles.titleSection}>
            <h1>{event.judul}</h1>
            <h2>{event.sub_judul}</h2>
          </section>

          <section className={styles.metaSection}>
            <p>
              {event.tempat}, {formatDateDMY(event.tanggal)}
            </p>
          </section>

          <section className={styles.descriptionSection}>
            <p>{event.deskripsi}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
