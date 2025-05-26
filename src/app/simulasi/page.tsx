import Image from 'next/image';
import styles from './Simulasi.module.css';

type Komunitas = {
  id: number;
  title: string;
  user_id: number;
  image: string;
  image_logo: string;
  image_banner: string;
  phone: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
};

const getKomunitas = async (): Promise<Komunitas[]> => {
  const res = await fetch('http://127.0.0.1:8000/api/komunitas', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil data komunitas');
  }

  const json = await res.json();

  let dataArray: Komunitas[] = [];

  if (Array.isArray(json.data)) {
    dataArray = json.data;
  } else if (json.data?.data && Array.isArray(json.data.data)) {
    dataArray = json.data.data;
  }

  // Sort berdasarkan id ascending
  dataArray.sort((a, b) => a.id - b.id);

  return dataArray;
};


const imageUrl = (path: string) => `http://127.0.0.1:8000/storage/${path}`;

const KomunitasPage = async () => {
  const data = await getKomunitas();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Daftar Komunitas</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>User ID</th>
              <th>Logo</th>
              <th>Image</th>
              <th>Banner</th>
              <th>Phone</th>
              <th>Deskripsi</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((komunitas) => (
              <tr key={komunitas.id}>
                <td>{komunitas.id}</td>
                <td>{komunitas.title}</td>
                <td>{komunitas.user_id}</td>
                <td>
                  {komunitas.image_logo && (
                    <div className={styles.imageWrapperLogo}>
                      <Image
                        src={imageUrl(komunitas.image_logo)}
                        alt={`${komunitas.title} Logo`}
                        fill
                        className={styles.imageRoundedCircle}
                      />
                    </div>
                  )}
                </td>
                <td>
                  {komunitas.image && (
                    <div className={styles.imageWrapperSmall}>
                      <Image
                        src={imageUrl(komunitas.image)}
                        alt={`${komunitas.title} Image`}
                        fill
                        className={styles.imageRounded}
                      />
                    </div>
                  )}
                </td>
                <td>
                  {komunitas.image_banner && (
                    <div className={styles.imageWrapperBanner}>
                      <Image
                        src={imageUrl(komunitas.image_banner)}
                        alt={`${komunitas.title} Banner`}
                        fill
                        className={styles.imageRounded}
                      />
                    </div>
                  )}
                </td>
                <td>{komunitas.phone}</td>
                <td title={komunitas.deskripsi} className={styles.description}>
                  {komunitas.deskripsi}
                </td>
                <td>{new Date(komunitas.created_at).toLocaleDateString()}</td>
                <td>{new Date(komunitas.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KomunitasPage;
