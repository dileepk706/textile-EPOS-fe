import Button, { ButtonProps } from '@mui/material/Button';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

type FactoryButtonVariant = 'primary' | 'secondary';

type FactoryButtonProps = Omit<ButtonProps, 'variant'> & {
  factoryVariant?: FactoryButtonVariant;
  to?: any;
};

export default function FactoryButton({
  factoryVariant = 'primary',
  size = 'small',
  sx,
  children,
  ...other
}: FactoryButtonProps) {
  const isPrimary = factoryVariant === 'primary';
  const sizeStyles = {
    small: {
      minHeight: 26,
      px: 2,
      fontSize: 13,
      fontWeight: 100,
    },
    medium: {
      minHeight: 36,
      px: 3,
      fontSize: 14,
      fontWeight: 500,
    },
    large: {
      minHeight: 46,
      px: 4,
      fontSize: 16,
      fontWeight: 700,
    },
  }[size];

  return (
    <Button
      variant="outlined"
      size={size}
      sx={[
        (theme) => ({
          '@keyframes factoryButtonStripes': {
            from: {
              backgroundPosition: '0 0',
            },
            to: {
              backgroundPosition: '18px 0',
            },
          },
          borderRadius: 0.5,
          position: 'relative',
          overflow: 'hidden',
          ...sizeStyles,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: isPrimary
            ? theme.palette.primary.dark
            : alpha(theme.palette.grey[700], 0.55),
          bgcolor: isPrimary ? theme.palette.primary.dark : theme.palette.common.white,
          color: isPrimary ? theme.palette.common.white : theme.palette.grey[700],
          boxShadow: 'none',
          lineHeight: 1,
          letterSpacing: 0,
          textTransform: 'uppercase',
          transition:
            'color 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            opacity: 0,
            backgroundImage: isPrimary
              ? `repeating-linear-gradient(
                  45deg,
                  ${alpha(theme.palette.common.black, 0.34)} 0,
                  ${alpha(theme.palette.common.black, 0.34)} 2px,
                  transparent 2px,
                  transparent 7px
                )`
              : `repeating-linear-gradient(
                  45deg,
                  ${alpha(theme.palette.common.white, 0.28)} 0,
                  ${alpha(theme.palette.common.white, 0.28)} 2px,
                  transparent 2px,
                  transparent 7px
                )`,
            backgroundSize: '18px 18px',
            transition: 'opacity 180ms ease',
            pointerEvents: 'none',
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
          '&:hover': {
            borderColor: isPrimary
              ? alpha(theme.palette.grey[700], 0.55)
              : theme.palette.common.black,
            bgcolor: isPrimary ? theme.palette.common.white : theme.palette.common.black,
            color: isPrimary ? theme.palette.grey[700] : theme.palette.common.white,
            boxShadow: 'none',
            '&::before': {
              opacity: 1,
              animation: 'factoryButtonStripes 420ms linear infinite',
            },
          },
          '&.Mui-disabled': {
            borderColor: alpha(theme.palette.grey[700], 0.35),
            bgcolor: theme.palette.common.white,
            color: alpha(theme.palette.grey[700], 0.45),
          },
          '&.Mui-disabled::before': {
            display: 'none',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <span>{children}</span>
    </Button>
  );
}
