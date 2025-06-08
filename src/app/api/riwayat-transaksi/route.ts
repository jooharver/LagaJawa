import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../lib/auth";
import pool from "../../lib/db";

type Transaction = {
  id_transactions: number;
  user_id: number;
  no_pemesanan: string;
  payment_method: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  paid_at?: string | null;
  status: string;
};

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || typeof payload.userId !== "number") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = payload.userId;

    const { searchParams } = new URL(req.url);
    const paymentStatus = searchParams.get("payment_status");
    const tanggal = searchParams.get("tanggal");

    let query = "SELECT * FROM transactions WHERE user_id = ?";
    const values: (string | number)[] = [userId];

    if (paymentStatus) {
      query += " AND payment_status = ?";
      values.push(paymentStatus);
    }

    if (tanggal) {
      query += " AND DATE(created_at) = ?";
      values.push(tanggal);
    }

    // Query without generic typing and cast the result
    const [rows] = await pool.query(query, values);

    return NextResponse.json({ data: rows as Transaction[] });
  } catch (error) {
    console.error("Gagal mengambil transaksi:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
