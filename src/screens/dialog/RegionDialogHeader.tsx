import { Close } from '@mui/icons-material';
import { CardHeader, IconButton } from '@mui/material';
import { Region } from 'types/api.types';

interface RegionContentProps {
  region: Region;
  onClose?: () => void;
}

function RegionDialog({ region, onClose }: RegionContentProps) {
  return (
    <CardHeader title={ region.name } action={ <IconButton onClick={ onClose }><Close/></IconButton> }/>
  );
}

export default RegionDialog;

