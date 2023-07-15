import { Close } from '@mui/icons-material';
import { CardHeader, IconButton } from '@mui/material';
import { Departement } from 'types/api.types';

interface DepartementDialogHeaderProps {
  departement: Departement;
  onClose?: () => void;
}

function DepartementDialogHeader({ departement, onClose }: DepartementDialogHeaderProps) {
  return (
    <CardHeader title={ `${ departement.name } (${ departement.id })` }
                action={ <IconButton onClick={ onClose }><Close/></IconButton> }/>
  );
}

export default DepartementDialogHeader;

