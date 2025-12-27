import React from 'react';
import { Box } from '@chakra-ui/react';

interface MarkerTooltipProps {
  publication: any;
  isVisible: boolean;
}

const MarkerTooltip: React.FC<MarkerTooltipProps> = ({
  publication,
  isVisible
}) => {
  if (!isVisible || !publication) return null;

  return (
    <Box display="none" />
  );
};

export default MarkerTooltip;
