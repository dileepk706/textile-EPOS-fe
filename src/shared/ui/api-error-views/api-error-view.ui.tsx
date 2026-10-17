import { Box, Button, Stack, SxProps, Theme } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import EmptyContent from 'shared/ui/empty-content';
import Iconify from 'shared/ui/iconify';

// ----------------------------------------------------------------------

export type ApiErrorDetails = {
  title: string;
  description: string;
  status?: number;
  isNotFound: boolean;
};

export function getApiErrorMessage(
  error: unknown,
  fallbackTitle?: string,
  fallbackDescription?: string
): ApiErrorDetails {
  if (isRouteErrorResponse(error)) {
    const isNotFound = error.status === 404;
    const title = fallbackTitle || (isNotFound ? 'Resource Not Found' : `Error ${error.status}`);
    const description =
      typeof error.data === 'string'
        ? error.data
        : error.data?.message ||
          error.statusText ||
          fallbackDescription ||
          (isNotFound
            ? 'The requested resource could not be found or may have been deleted.'
            : 'Something went wrong while processing your request.');

    return {
      title,
      description,
      status: error.status,
      isNotFound,
    };
  }

  const anyError = error as any;
  const status = anyError?.response?.status || anyError?.status;
  const serverMessage =
    anyError?.response?.data?.message ||
    anyError?.response?.data?.error ||
    anyError?.response?.data?.detail;

  const isNotFound = status === 404;

  if (isNotFound) {
    return {
      title: fallbackTitle || 'Resource Not Found',
      description:
        serverMessage ||
        fallbackDescription ||
        'The requested resource could not be found or may have been deleted.',
      status: 404,
      isNotFound: true,
    };
  }

  if (serverMessage && typeof serverMessage === 'string') {
    return {
      title: fallbackTitle || (status ? `Error ${status}` : 'Request Failed'),
      description: serverMessage,
      status,
      isNotFound: false,
    };
  }

  if (error instanceof Error && error.message) {
    return {
      title: fallbackTitle || 'Something Went Wrong',
      description: error.message,
      status,
      isNotFound: false,
    };
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return {
      title: fallbackTitle || 'Error Occurred',
      description: error,
      status,
      isNotFound: false,
    };
  }

  return {
    title: fallbackTitle || 'Something Went Wrong',
    description:
      fallbackDescription || 'An unexpected error occurred. Please try again or return to the previous page.',
    status,
    isNotFound: false,
  };
}

function useSafeRouteError() {
  try {
    return useRouteError();
  } catch {
    return undefined;
  }
}

// ----------------------------------------------------------------------

export type ApiErrorViewProps = {
  error?: unknown;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onBack?: () => void;
  backHref?: string;
  backLabel?: string;
  retryLabel?: string;
  showBack?: boolean;
  showRetry?: boolean;
  action?: React.ReactNode;
  disableHelmet?: boolean;
  filled?: boolean;
  sx?: SxProps<Theme>;
};

export function ApiErrorView({
  error: errorProp,
  title: titleProp,
  description: descriptionProp,
  onRetry,
  onBack,
  backHref,
  backLabel = 'Go Back',
  retryLabel = 'Try Again',
  showBack = true,
  showRetry = true,
  action,
  disableHelmet = false,
  filled = true,
  sx,
}: ApiErrorViewProps) {
  const routeError = useSafeRouteError();
  const error = errorProp !== undefined ? errorProp : routeError;
  const navigate = useNavigate();

  const details = getApiErrorMessage(error, titleProp, descriptionProp);
  const title = titleProp || details.title;
  const description = descriptionProp || details.description;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      navigate(backHref);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      {!disableHelmet && title && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 380,
          px: 2,
          py: 4,
          ...sx,
        }}
      >
        <Box sx={{ maxWidth: 540, width: 1, mx: 'auto' }}>
          <EmptyContent
            filled={filled}
            title={title}
            description={description}
            action={
              action || (
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3, flexWrap: 'wrap', gap: 1.5 }}>
                  {showBack && (
                    <Button
                      onClick={handleBack}
                      variant="contained"
                      startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                    >
                      {backLabel}
                    </Button>
                  )}

                  {showRetry && (onRetry || errorProp === undefined) && (
                    <Button
                      onClick={handleRetry}
                      variant="outlined"
                      startIcon={<Iconify icon="solar:restart-bold" />}
                    >
                      {retryLabel}
                    </Button>
                  )}
                </Stack>
              )
            }
            sx={{ py: 6 }}
          />
        </Box>
      </Box>
    </>
  );
}

export default ApiErrorView;
