import { useDropzone } from 'react-dropzone';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
//
import { Button } from '@mui/material';
import { useState } from 'react';
import { useBoolean } from 'shared/hooks/useBoolean';
import Iconify from 'shared/ui/iconify';
import Image from 'shared/ui/image';
//
import Lightbox from 'shared/ui/lightbox/lightbox';
import { UploadProps } from './types';
import RejectionFiles from './ErrorsRejectionFiles';

// ----------------------------------------------------------------------

export default function UploadAvatar({
  error,
  file,
  disabled,
  helperText,
  sx,
  ...other
}: UploadProps) {
  const lightbox = useBoolean();

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled,
    accept: {
      'image/*': [],
    },
    ...other,
  });

  const hasFile = !!file;

  const hasError = isDragReject || !!error;

  const imgUrl = typeof file === 'string' ? file : file?.preview;

  const renderPreview = hasFile && (
    <Image
      alt="avatar"
      src={imgUrl}
      sx={{
        width: 1,
        height: 1,
        borderRadius: '3%',
      }}
    />
  );

  const renderPlaceholder = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1}
      className="upload-placeholder"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        borderRadius: '3%',
        position: 'absolute',
        color: 'text.disabled',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          opacity: 0.72,
        },
        ...(hasError && {
          color: 'error.main',
          bgcolor: 'error.lighter',
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: 'common.white',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
        }),
      }}
    >
      <Iconify icon="solar:camera-add-bold" width={32} />

      <Typography variant="caption">{file ? 'Update photo' : 'Upload photo'}</Typography>
    </Stack>
  );

  const renderContent = (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '3%',
        position: 'relative',
      }}
    >
      {renderPreview}
      {renderPlaceholder}
    </Box>
  );

  const [renderOptionsDisplay, setRenderOptionsDisplay] = useState('none');

  const renderOptions = (
    <Stack
      sx={{
        position: 'absolute',
        bgcolor: 'white',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        gap: 1,
        display: renderOptionsDisplay,
      }}
    >
      <Button onClick={lightbox.onTrue} sx={{ typography: 'caption' }} size="small" variant="soft">
        View
      </Button>
      <Button sx={{ typography: 'caption' }} size="small" variant="soft" {...getRootProps()}>
        Change
      </Button>
    </Stack>
  );
  const lightBox = (
    <Lightbox
      open={lightbox.value}
      close={lightbox.onFalse}
      slides={[
        {
          src: imgUrl ?? '',
          alt: 'image',
          width: 3840,
          height: 560,
        },
      ]}
      disabledZoom
      disabledTotal
      disabledVideo
      disabledCaptions
      disabledSlideshow
      // disabledThumbnails={state.disabledThumbnails}
      disabledFullscreen
    />
  );
  return (
    <>
      <Box
        {...(!hasFile ? getRootProps() : {})}
        onMouseEnter={() => {
          setRenderOptionsDisplay(hasFile ? '' : 'none');
        }}
        onMouseLeave={() => {
          setRenderOptionsDisplay('none');
        }}
        sx={{
          p: 1,
          m: 'auto',
          width: 144,
          height: 144,
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: '3%',
          position: 'relative',
          border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            borderColor: 'error.light',
          }),
          ...(hasFile && {
            ...(hasError && {
              bgcolor: 'error.lighter',
            }),
            '&:hover .upload-placeholder': {
              opacity: 1,
            },
          }),
          ...sx,
        }}
      >
        <input {...getInputProps()} />

        {renderContent}
        {renderOptions}
      </Box>

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections as any} />
      {lightBox}
    </>
  );
}
