import { NextRequest, NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const tanggal = searchParams.get("tanggal");

  try {
    let query = "SELECT * FROM bookings WHERE 1=1";
    const values: any[] = [];

    if (status) {
      query += " AND status = ?";
      values.push(status);
    }

    if (tanggal) {
      query += " AND DATE(tanggal) = ?";
      values.push(tanggal);
    }

    const [rows] = await pool.query(query, values);

    return NextResponse.json({ data: rows });
  } catch (error: any) {
    console.error("Error fetching transaksi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data transaksi" },
      { status: 500 }
    );
  }
}
