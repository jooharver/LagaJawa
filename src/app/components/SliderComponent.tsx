import React from 'react';
import Image from 'next/image';

const SliderComponent = () => {
  return (
    <div className="wrapper">
      {/* Slider 1 - 10 items, duration 24s */}
      <div className="slider" style={{
        '--width': '200px',
        '--height': '50px',
        '--quantity': '10',
        '--duration': '24s'
      } as React.CSSProperties}>
        <div className="list">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="item" style={{ '--position': i + 1 } as React.CSSProperties}>
              <img src={`/images/c${i + 1}.jpg`} alt="" />
            </div>
          ))}
        </div>
      </div>

      {/* Slider 2 - 9 items, duration 20s */}
      <div className="slider" data-reverse="true" style={{
        '--width': '200px',
        '--height': '200px',
        '--quantity': '9',
        '--duration': '20s'
      } as React.CSSProperties}>
        <div className="list">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="item" style={{ '--position': i + 1 } as React.CSSProperties}>
              <Image
                src={`/images/d${i + 1}.jpg`}
                alt={`Gambar ${i + 1}`}
                width={400} // ganti sesuai kebutuhan
                height={300} // ganti sesuai kebutuhan
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;
