import Link from "next/link";
import Button from "./components/Button";
import ProductCard from "./components/ProductCard";
import FeatureCard from "./components/FeatureCard";
import FeatureCardBG from "./components/FeatureCardBG";

export default function Home(){
  return(
    <main>
      <h1>Hello World</h1>\
      <Link href="/users">Users</Link>
      <div><h1>Variasi Button :</h1></div>
      <Button className='bg-blue-500' variant="primary" href="/users">Login</Button>
      <Button variant="secondary">Daftar</Button>
      <Button variant="outline">Kontak</Button>

      <div><h1>Card 1</h1></div>
      <ProductCard 
        title="Lapangan Futsal A" 
        description="Rumput sintetis, cocok untuk turnamen kecil." 
        imageUrl="/images/card1.jpg" // gambar dari folder public/images
      />
      <div><h1>Card 2</h1></div>
      <FeatureCard
        title="Sistem Skor Otomatis"
        description="Skor pertandingan secara real-time dengan sistem yang terintegrasi."
        imageUrl="/images/card1.jpg"
        buttonText="Learn More"
        buttonComponent={
          <Button href="/users" variant="outline" className="border-2 border-gray-900 text-gray-900 !text-gray-900 !border-gray-900">
            Learn More
          </Button>
        }
      />

      <FeatureCard
        title="Sistem Skor Otomatis"
        description="Skor pertandingan secara real-time dengan sistem yang terintegrasi."
        imageUrl="/images/card1.jpg"
      />
      <div><h1>Card 3</h1></div>
      <FeatureCardBG
        title="Sistem Skor Otomatis"
        description="Skor pertandingan secara real-time dengan sistem yang terintegrasi."
        imageUrl="/images/card1.jpg"
        backgroundUrl="/images/card-texture2.jpg"
        buttonComponent={
          <Button variant="outline" className="border-2 border-white text-white !border-white !text-white">
            Learn More
          </Button>
        }
      />

    </main>
  )
}