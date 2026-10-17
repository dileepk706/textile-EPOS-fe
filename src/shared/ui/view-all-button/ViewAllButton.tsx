import { Box, Button } from '@mui/material';
import { useRouter } from '@routes/hook';
import { useNavigate } from 'react-router-dom';
import Iconify from '../iconify';

type Props = {
  url: string;
  dataToPassNewRoute?: any;
};
function ViewAllButton({ url, dataToPassNewRoute }: Props) {
  const router = useRouter();

  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2, textAlign: 'right' }}>
      <Button
        onClick={() => {
          if (dataToPassNewRoute) {
            navigate(url, { state: { data: dataToPassNewRoute } });
          } else {
            router.push(url);
          }
        }}
        size="small"
        color="inherit"
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
      >
        View All
      </Button>
    </Box>
  );
}

export default ViewAllButton;
