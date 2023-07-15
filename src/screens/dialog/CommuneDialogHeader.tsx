import { Close } from '@mui/icons-material';
import { CardHeader, IconButton } from '@mui/material';
import { Commune } from 'types/api.types';

interface CommuneContentHeaderProps {
  commune: Commune;
  onClose?: () => void;
}

function CommuneDialogHeader({ commune, onClose }: CommuneContentHeaderProps) {
  return (
    <CardHeader title={ `${ commune.name } ${ commune.zipCode ? `(${ commune.zipCode })` : '' }` }
                action={ <IconButton onClick={ onClose }><Close/></IconButton> }/>
  );
}

export default CommuneDialogHeader;

