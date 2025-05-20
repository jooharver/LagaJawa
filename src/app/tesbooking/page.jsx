'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TesBooking.module.css';

const courts = ['Court 1', 'Court 2', 'Court 3', 'Court 4', 'Court 5'];
const times = Array.from({ length: 18 }, (_, i) => `${6 + i}:00`);

const dates = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);

  const dayLabel = date.toLocaleDateString('id-ID', { weekday: 'short' });
  const dateNumber = date.getDate();
  const monthName = date.toLocaleDateString('id-ID', { month: 'short' });

  return {
    label: dayLabel,
    date: `${dateNumber} ${monthName}`,
    fullDate: date.toISOString().split('T')[0],
  };
});

const PRICE_PER_SLOT = 100_000;

function TypingText({ texts }) {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[textIndex];
    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + currentText[charIndex]);
        setCharIndex(charIndex + 1);
      }, 70);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setDisplayedText('');
        setCharIndex(0);
        setTextIndex((textIndex + 1) % texts.length);
      }, 5000);
      return () => clearTimeout(pause);
    }
  }, [charIndex, textIndex, texts]);

  return <h2>{displayedText}<span className={styles.cursor}>|</span></h2>;
}

function encodeBookingData(data) {
  return encodeURIComponent(btoa(JSON.stringify(data)));
}

export default function TesBookingPage() {
  const router = useRouter();
  const [activeDate, setActiveDate] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const prevTotalRef = useRef(0);

  const toggleBooking = (rowIdx, colIdx) => {
    const key = `${rowIdx}-${colIdx}`;
    if (bookedSlots.includes(key)) return;

    setSelectedSlots(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const selectedKeys = Object.keys(selectedSlots).filter(k => selectedSlots[k]);
  const selectedCount = selectedKeys.length;
  const totalPrice = selectedCount * PRICE_PER_SLOT;

  useEffect(() => {
    const duration = 350;
    const start = prevTotalRef.current;
    const end = totalPrice;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(start + (end - start) * progress);
      setAnimatedTotal(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        prevTotalRef.current = end;
      }
    };

    requestAnimationFrame(step);
  }, [totalPrice]);

  useEffect(() => {
    const selectedDate = dates[activeDate].fullDate;
    setLoading(true);
  
    fetch(`/api/bookings?booking_date=${selectedDate}`)
      .then(res => res.json())
      .then(result => {
        const bookings = result.data;
        if (!Array.isArray(bookings)) {
          console.error('Data booking bukan array:', result);
          setBookedSlots([]);
          return;
        }
  
        const booked = [];
  
        bookings.forEach((booking) => {
          const colIdx = booking.court_id - 1;
  
          // booking.time_slots = array of strings, eg ['06:00', '07:00', '08:00']
          booking.time_slots.forEach(timeSlot => {
            const hour = parseInt(timeSlot.split(':')[0], 10);
            const rowIdx = hour - 6; // karena times mulai dari jam 6:00
  
            if (rowIdx >= 0 && rowIdx < times.length) {
              const slotKey = `${rowIdx}-${colIdx}`;
              booked.push(slotKey);
            }
          });
        });
  
        setBookedSlots(booked);
      })
      .catch(err => {
        console.error('Gagal memuat data booking:', err);
        setBookedSlots([]);
      })
      .finally(() => setLoading(false));
  }, [activeDate]);
  
  const handlePembayaran = () => {
    if (selectedKeys.length === 0) return;
  
    const selectedDate = dates[activeDate].fullDate;
    const grouped = {};
  
    for (const key of selectedKeys) {
      const [row, col] = key.split('-').map(Number);
      if (!grouped[col]) grouped[col] = [];
      grouped[col].push(row);
    }
  
    const bookingDetails = Object.entries(grouped).map(([col, rows]) => {
      const sortedRows = rows.sort((a, b) => a - b);
      const time_slots = sortedRows.map(r => times[r]);
      return {
        court: courts[col],
        court_id: parseInt(col, 10) + 1,
        time_slots,
      };
    });
  
    const payload = {
      date: selectedDate,
      bookings: bookingDetails,
      totalPrice
    };
  
    const encoded = encodeBookingData(payload);
    router.push(`/tespembayaran?data=${encoded}`);
  };
  

  return (
    <div className={styles.container}>
      <section className={styles.promo}>
        <div className={styles.typingText}>
          <TypingText texts={['Booking bulanan atau event?', 'Hubungi kami untuk diskon khusus!']} />
        </div>
        <button className={styles.contactBtn}>Hubungi Kami</button>
      </section>

      <div className={styles.dateSelector}>
        {dates.map((d, i) => (
          <div
            key={i}
            onClick={() => setActiveDate(i)}
            className={`${styles.dateItem} ${i === activeDate ? styles.activeDate : ''}`}
          >
            <div className={styles.dayName}>{d.label}</div>
            <div className={styles.dateNumber}>{d.date.split(' ')[0]}</div>
            <div className={styles.monthName}>{d.date.split(' ')[1]}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Memuat jadwal booking...</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div className={styles.timeColumn}></div>
            {courts.map((court, index) => (
              <div key={index} className={styles.courtHeader}>{court}</div>
            ))}
          </div>
          {times.map((time, rowIdx) => (
            <div key={rowIdx} className={styles.row}>
              <div className={styles.timeColumn}>{time}</div>
              {courts.map((_, colIdx) => {
                const slotKey = `${rowIdx}-${colIdx}`;
                const isBooked = selectedSlots[slotKey];
                const isSlotBooked = bookedSlots.includes(slotKey);

                console.log('Rendering slot', slotKey, 'isSlotBooked:', isSlotBooked);

                return (
                  <div
                    key={colIdx}
                    className={`${styles.cell} ${isBooked ? styles.selected : ''} ${isSlotBooked ? styles.booked : ''}`}
                    onClick={() => toggleBooking(rowIdx, colIdx)}
                    style={{ cursor: isSlotBooked ? 'not-allowed' : 'pointer' }}
                  >
                    {isBooked && <div className={styles.checkmark}>✔</div>}
                    {isSlotBooked && <div className={styles.bookedLabel}>Booked</div>}
                  </div>
                );
              })}

            </div>
          ))}
        </div>
      )}

      {selectedCount > 0 && (
        <div className={styles.footerPopup}>
          <div>
            <div>Total</div>
            <div className={styles.totalAmount}>Rp {animatedTotal.toLocaleString('id-ID')}</div>
          </div>
          <button className={styles.payBtn} onClick={handlePembayaran}>PEMBAYARAN</button>
        </div>
      )}
    </div>
  );
}
