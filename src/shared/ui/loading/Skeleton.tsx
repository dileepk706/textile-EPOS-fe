import { Skeleton as Sk } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function Skeleton({ width, height }: { width?: number; height?: number }) {
  return (
    <Sk
      sx={{
        width: width || 1,
        height: height || 100,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
      }}
      variant="rounded"
      animation="wave"
    />
  );
}
