// Import necessary components and icons
import ButtonGroup from '@mui/joy/ButtonGroup';
import IconButton from '@mui/joy/IconButton';
import { Star, StarBorder } from '@mui/icons-material';
import React, { useEffect } from 'react';

interface RatingProps {
  name: string;
  value: number;
  onChange?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, newValue: number) => void;
  disabled?: boolean;
}


const Rating = ({ name, value, onChange, disabled = false }: RatingProps) => {
  // Define the current rating state
  const [rating, setRating] = React.useState<number>(value);

  // Update local state when the value prop changes
  useEffect(() => {
    setRating(value);
  }, [value]);

  // Handle rating click
  const handleRating = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, newRating: number) => {
    if (disabled) return; // Prevent updates if disabled

    // Update local state
    setRating(newRating);

    if (onChange) { // Check if onChange is provided
      const customEvent = {
        ...event,
        target: {
          ...event.target,
          name: name,
          value: newRating,
        },
      };

      // Call the onChange callback with the custom event and the new rating
      onChange(customEvent, newRating);
    }
  };

  // Render the stars
  return (
    <ButtonGroup color="primary" orientation="horizontal" spacing={1} variant="plain">
      {[1, 2, 3, 4, 5].map((index) => (
        <IconButton 
          key={index} 
          onClick={(event) => handleRating(event, index)}
          disabled={disabled}
        >
          {index <= rating ? <Star /> : <StarBorder />}
        </IconButton>
      ))}
    </ButtonGroup>
  );
};

export default Rating;
