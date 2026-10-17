import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  FormLabel,
  InputAdornment,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import Iconify from '../iconify';

export default function RHFUploadFile({ name, maxSize, accept, onDrop, helperText }: any) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value } = field;

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          accept,
          maxSize,
          multiple: false,
          onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            onChange(file);
            if (onDrop) onDrop(file);
          },
        });

        return (
          <Box>
            <Paper {...getRootProps()}>
              <TextField
                value={value && value.name}
                variant="outlined"
                label="Attach Document"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        sx={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          height: '100%',
                          px: 2,
                        }}
                        startIcon={<Iconify icon="material-symbols:folder-open-outline-sharp" />}
                      >
                        <input {...getInputProps()} />
                        Browse Files
                      </Button>
                    </InputAdornment>
                  ),
                  sx: {
                    pr: 0, // remove padding to align button flush
                  },
                }}
              />
            </Paper>

            {helperText && <Box mt={1}>{helperText}</Box>}
            {error && (
              <Typography color="error" variant="caption">
                {error.message}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
}
