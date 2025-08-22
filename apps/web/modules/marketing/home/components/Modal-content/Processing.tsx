import Modal from '@marketing/home/components/Popups/Modal';
import { useEffect, useState } from 'react';

function ProcessingModal() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Modal isOpen>
      <p className="font-button-base text-center text-5xl uppercase text-white">
        Processing{'.'.repeat(dots)}
      </p>
      <p className="font-button-base mt-5 max-w-[600px] text-2xl uppercase text-white">
        It will take around a minute and a half.
      </p>
    </Modal>
  );
}

export default ProcessingModal;
