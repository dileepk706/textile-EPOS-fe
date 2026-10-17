import { useCallback } from 'react';
// @mui
import { m } from 'framer-motion';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
// components
import Iconify from 'shared/ui/iconify';
import CustomPopover, { usePopover } from 'shared/ui/custom-popover';
import { useQueryClient } from '@tanstack/react-query';
import { getTextileQueryOptions } from 'entities/textile/textile.api';
import { varHover } from 'shared/ui/animate';
import { useTextilesStore } from 'entities/textile/textile.store';

// ----------------------------------------------------------------------

type Props = {
  mini?: boolean;
};

export default function TextilesLabel({ mini }: Props) {
  const popover = usePopover();
  const queryClient = useQueryClient();

  const { textile } = useTextilesStore();

  const renderContent = mini ? (
    <ButtonBase
      // onClick={popover.onOpen}
      sx={{
        width: 40,
        height: 40,
        borderRadius: 1,
        border: (theme) => `solid 1px ${alpha(theme.palette.secondary.main, 0.1)}`,
        bgcolor: alpha('#ffffff', 0.05),
        ...(popover.open && {
          bgcolor: alpha('#ffffff', 0.12),
        }),
      }}
    >
      <Avatar
        src={''}
        alt={'textile image'}
        sx={{
          width: 32,
          height: 32,
          bgcolor: 'transparent',
          color: 'secondary.main',
        }}
      >
        <Iconify icon="arcticons:shop" width={24} />
      </Avatar>
    </ButtonBase>
  ) : (
    <ButtonBase
      component={m.button}
      whileTap="tap"
      // whileHover="hover"
      variants={varHover(0.98)}
      // onClick={popover.onOpen}
      sx={{
        px: 1.5,
        py: 1,
        width: '100%',
        borderRadius: 1,
        textAlign: 'left',
        justifyContent: 'flex-start',
        border: (theme) => `solid 1px ${alpha(theme.palette.divider, 0.1)}`,
        bgcolor: alpha('#ffffff', 0.03),
        ...(popover.open && {
          bgcolor: alpha('#ffffff', 0.08),
        }),
      }}
    >
      <Avatar
        src={
          'https://thumbs.dreamstime.com/b/fabric-original-logo-creative-sign-company-identity-craft-store-advertising-poster-banner-flyer-vector-fabric-original-logo-122011576.jpg'
        }
        alt={'textile image'}
        sx={{
          width: 36,
          height: 36,
          bgcolor: alpha('#ffffff', 0.08),
          color: 'secondary.main',
          border: (theme) => `solid 1px ${alpha(theme.palette.secondary.main, 0.2)}`,
        }}
      ></Avatar>

      <Stack sx={{ ml: 1.5, flexGrow: 1, overflow: 'hidden' }}>
        <Typography variant="subtitle2" noWrap sx={{ color: 'common.white', fontWeight: 700 }}>
          {textile?.name}
        </Typography>
        <Typography variant="caption" noWrap sx={{ color: 'grey.500' }}>
          {textile?.address?.city}
        </Typography>
      </Stack>

      {/* <Iconify
        icon={popover.open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
        width={16}
        sx={{ color: 'grey.600', ml: 1 }}
      /> */}
    </ButtonBase>
  );

  return (
    <>
      {renderContent}

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 220, p: 0 }}>
        <Box sx={{ p: 1 }}>
          <Typography
            variant="overline"
            sx={{ px: 1, py: 0.5, color: 'text.disabled', display: 'block' }}
          >
            Switch Branch
          </Typography>
        </Box>
      </CustomPopover>
    </>
  );
}
