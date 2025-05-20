'use client';

import { useState } from 'react';

export default function BookingSimulationPage() {
  const [formData, setFormData] = useState({
    requester_id: '',
    court_id: '',
    booking_date: '',
    start_time: '',
    end_time: ''
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Format waktu agar sesuai dengan H:i:s
    const formattedStartTime = formData.start_time ? `${formData.start_time}:00` : '';
    const formattedEndTime = formData.end_time ? `${formData.end_time}:00` : '';

    const payload = {
      requester_id: formData.requester_id,
      court_id: formData.court_id,
      booking_date: formData.booking_date, // sudah Y-m-d
      start_time: formattedStartTime,
      end_time: formattedEndTime
    };

    try {
      const res = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
      setResponse({ success: false, message: 'Terjadi kesalahan saat mengirim data.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Simulasi Booking</h1>
      <table className="w-full border mb-4">
        <tbody>
          <tr>
            <td className="border px-2 py-1">Requester ID</td>
            <td>
              <input
                type="text"
                name="requester_id"
                value={formData.requester_id}
                onChange={handleChange}
                className="w-full border px-2 py-1"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Court ID</td>
            <td>
              <input
                type="text"
                name="court_id"
                value={formData.court_id}
                onChange={handleChange}
                className="w-full border px-2 py-1"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Booking Date</td>
            <td>
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                className="w-full border px-2 py-1"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-1">Start Time</td>
            <td>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full border px-2 py-1"
              />
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-1">End Time</td>
            <td>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full border px-2 py-1"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Mengirim...' : 'Kirim Booking'}
      </button>

      {response && (
        <div className="mt-4 p-4 border bg-gray-100 rounded">
          <h2 className="font-semibold">Respon API:</h2>
          <pre className="text-sm text-gray-700">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
