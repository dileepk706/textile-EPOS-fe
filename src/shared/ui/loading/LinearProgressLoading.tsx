import LinearProgress from '@mui/material/LinearProgress';

type LinearProgressLoadingProps = {
  loading?: boolean;
};

export default function LinearProgressLoading({ loading = false }: LinearProgressLoadingProps) {
  if (!loading) return null;

  return <LinearProgress />;
}
