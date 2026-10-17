import { useTheme, useMediaQuery } from '@mui/material';

export function useTableHeight() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // Extra small screens
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Small screens
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // Medium screens
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl')); // Large screens
  const isXl = useMediaQuery(theme.breakpoints.up('xl')); // Extra-large screens

  if (isXs) return 400;
  if (isSm) return 450;
  if (isMd) return 470;
  if (isLg) return 510;
  if (isXl) return 690;
  return 500;

  //   return {
  //     height: {
  //       xs: isXs ? 400 : undefined, // Adjust height for extra small screens
  //       sm: isSm ? 450 : undefined, // Adjust height for small screens
  //       md: isMd ? 470 : undefined, // Adjust height for medium screens
  //       lg: isLg ? 510 : undefined, // Adjust height for large screens
  //       xl: isXl ? 800 : undefined, // Adjust height for extra-large screens
  //     },
  //   };
}
