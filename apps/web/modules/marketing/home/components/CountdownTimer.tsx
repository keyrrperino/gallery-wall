import { useEffect, useState } from 'react';

export const CountdownTimer = ({
  initialCount,
  onEnd,
}: {
  initialCount: number;
  onEnd: () => void;
}) => {
  const [count, setCount] = useState(initialCount);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (count > 0) {
      if (count === 1) {
        setTimeout(() => {
          setIsVisible(false);
        }, 900);
      }
      setTimeout(() => {
        setIsVisible(true);
        setCount(count - 1);
      }, 1000);
    } else {
      setCount(0);
      onEnd();
    }
  }, [count, onEnd]);

  return (
    count > 0 && (
      <div
        className="font-button-base absolute z-10 object-center text-center text-9xl font-bold text-white transition-all duration-500"
        style={{
          animation: 'anim 1s ease-in-out infinite',
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
        }}
      >
        {isVisible ? count : ''}
      </div>
    )
  );
};
