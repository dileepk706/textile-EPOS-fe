import { Box, Stack, Typography, alpha, useTheme } from '@mui/material';

export const STEPS = [
  'Gym Details',
  //  'Choose Plan', 'Enhance'
];

export default function OnboardingStepper({ activeStep }: { activeStep: number }) {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 5, width: '100%', justifyContent: 'center' }}>
      {STEPS.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;

        return (
          <Stack key={step} direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                transition: theme.transitions.create(['background-color', 'color']),
                bgcolor:
                  isActive || isCompleted
                    ? 'primary.main'
                    : alpha(theme.palette.text.disabled, 0.16),
                color: isActive || isCompleted ? 'common.white' : 'text.disabled',
              }}
            >
              {index + 1}
            </Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: isActive ? 'text.primary' : 'text.disabled',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {step}
            </Typography>
            {index < STEPS.length - 1 && (
              <Box
                sx={{
                  width: 24,
                  height: 2,
                  bgcolor: isCompleted ? 'primary.main' : alpha(theme.palette.text.disabled, 0.16),
                  ml: 1,
                }}
              />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}
