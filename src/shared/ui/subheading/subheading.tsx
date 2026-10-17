import { Box, Typography } from '@mui/material';

export default function Subheading({ title, description }: { title: string; description: string }) {
  return (
    <Box>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
