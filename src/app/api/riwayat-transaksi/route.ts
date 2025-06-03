import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../lib/auth"; // pastikan path benar
import pool from "../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    console.log("Token diterima:", token);


    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    const { searchParams } = new URL(req.url);
    const paymentStatus = searchParams.get("payment_status");
    const tanggal = searchParams.get("tanggal");

    let query = "SELECT * FROM transactions WHERE user_id = ?";
    const values: any[] = [userId];

    if (paymentStatus) {
      query += " AND payment_status = ?";
      values.push(paymentStatus);
    }


    if (tanggal) {
      query += " AND DATE(created_at) = ?";
      values.push(tanggal);
    }

    const [rows] = await pool.query(query, values);

    return NextResponse.json({ data: rows });
  } catch (error: any) {
    console.error("Gagal mengambil transaksi:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
}
