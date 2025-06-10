'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Booking.module.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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

export default function BookingPage() {
  const router = useRouter();
  const [activeDate, setActiveDate] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courts, setCourts] = useState([]);
  const [priceMap, setPriceMap] = useState({});
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

  const selectedKeys = useMemo(() => (
    Object.keys(selectedSlots).filter(k => selectedSlots[k])
  ), [selectedSlots]);

  const totalPrice = useMemo(() => {
    return selectedKeys.reduce((sum, key) => {
      const [rowIdx, colIdx] = key.split('-').map(Number);
      const courtId = courts[colIdx]?.id_court;
      const courtPrice = priceMap[courtId];
  
      // Konversi ke number sebelum dijumlahkan
      const priceNumber = courtPrice ? parseFloat(courtPrice) : 0;
  
      return sum + priceNumber;
    }, 0);
  }, [selectedKeys, courts, priceMap]);
  
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
    fetch('http://localhost:8000/api/courts')
      .then(res => res.json())
      .then(result => {
        console.log('Response dari API courts:', result);
  
        let courtsData = result.data.data || result.data;
        
        // Urutkan courtsData berdasarkan id_court ascending
        courtsData = courtsData.sort((a, b) => a.id_court - b.id_court);
        console.log('Data lapangan courtsData setelah diurutkan:', courtsData);
  
        setCourts(courtsData);
  
        const map = {};
        courtsData.forEach(court => {
          map[court.id_court] = court.price_per_hour;
        });
        setPriceMap(map);
      })
      .catch(err => console.error('Gagal ambil data lapangan:', err));
  }, []);
  
  

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
          const colIdx = courts.findIndex(c => c.id_court === booking.court_id);
          booking.time_slots.forEach(timeSlot => {
            const hour = parseInt(timeSlot.split(':')[0], 10);
            const rowIdx = hour - 6;
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
  }, [activeDate, courts]);

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
      const duration = time_slots.length;
      const courtId = courts[col]?.id_court;
      const pricePerHour = parseFloat(priceMap[courtId]) || 0;
      const amount = duration * pricePerHour;
    
      return {
        court: courts[col]?.name,
        court_id: courtId,
        time_slots,
        amount,
        type: courts[col]?.type,
      };
    });
    

    const payload = {
      date: selectedDate,
      bookings: bookingDetails,
      totalPrice,
    };

    const encoded = encodeBookingData(payload);
    router.push(`/pembayaran?data=${encoded}`);
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
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Memuat jadwal booking...</p>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.headerRow}>
            <div className={styles.timeColumn}></div>
            {courts.map((court, index) => (
              <div key={index} className={styles.courtHeader}>{court.name}</div>
            ))}
          </div>
          {times.map((time, rowIdx) => (
            <div key={rowIdx} className={styles.row}>
              <div className={styles.timeColumn}>{time}</div>
              {courts.map((_, colIdx) => {
                const slotKey = `${rowIdx}-${colIdx}`;
                const isBooked = selectedSlots[slotKey];
                const isSlotBooked = bookedSlots.includes(slotKey);
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

      {selectedKeys.length > 0 && (
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
