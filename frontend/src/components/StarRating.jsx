import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, setRating, readOnly = true, size = 16 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hover || rating) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => setRating && setRating(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: readOnly ? 'default' : 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              color: isFilled ? '#f59e0b' : '#cbd5e1',
            }}
          >
            <Star
              size={size}
              fill={isFilled ? '#f59e0b' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
