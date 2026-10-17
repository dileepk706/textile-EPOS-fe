import { forwardRef } from 'react';
// @mui
import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
// routes
import { Typography } from '@mui/material';
import { useInRouterContext } from 'react-router-dom';
import { RouterLink } from '@routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'white' | 'black' | 'primary';
}

const LogoText = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, size = 'large', color = 'white', sx, ...other }, ref) => {
    const inRouter = useInRouterContext();

    // 🎯 Size system
    const sizeMap: any = {
      small: { variant: 'h6' },
      medium: { variant: 'h3' },
      large: { variant: 'h1' },
    };

    // 🎯 Color system
    const colorMap = {
      white: 'white',
      black: 'primary.dark',
      primary: 'primary.main',
    };

    const sizeDot = {
      small: 'h3',
      medium: 'h1',
      large: 'h1',
    };

    const logo = (
      <Box ref={ref} {...other} sx={sx}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'nowrap',
          }}
        >
          <Typography {...sizeMap[size]} color={colorMap[color]}>
            TextilesEPOS
            <Box component="span" sx={{ color: 'error.main', typography: sizeDot[size] }}>
              .
            </Box>
          </Typography>
          {/* <Typography {...sizeMap[size]} color="error.main" sx={{ opacity: 1 }}>
              .
            </Typography> */}
        </Box>
      </Box>
    );

    if (disabledLink || !inRouter) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default LogoText;
