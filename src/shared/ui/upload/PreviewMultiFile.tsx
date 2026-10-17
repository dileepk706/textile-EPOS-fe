import { Box, IconButton, Stack } from '@mui/material';
import { useEffect } from 'react';
import Iconify from 'shared/ui/iconify';

type MultiFilePreviewProps = {
  files: (File & { preview?: string })[];
  thumbnail?: boolean;
  onRemove?: (file: File) => void;
};

export default function MultiFilePreview({
  files = [],
  onRemove,
  thumbnail,
}: MultiFilePreviewProps) {
  useEffect(
    () => () => {
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    },
    [files]
  );

  return (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {files.map((file, index) => {
        const preview = typeof file === 'string' ? file : file.preview || URL.createObjectURL(file);

        return (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: 100,
              height: 100,
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px dashed #ccc',
            }}
          >
            <img
              src={preview}
              alt={file.name || `preview-${index}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {onRemove && (
              <IconButton
                size="small"
                onClick={() => onRemove(file)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(0,0,0,0.4)',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  },
                }}
              >
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}
