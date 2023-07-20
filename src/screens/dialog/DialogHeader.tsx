import { Close } from '@mui/icons-material';
import { CardHeader, IconButton } from '@mui/material';
import { Commune, Departement, Region } from 'types/api.types';

interface DialogHeaderProps {
  node: Region | Departement | Commune;
  onClose?: () => void;
}

function DialogHeader({ node, onClose }: DialogHeaderProps) {
  if ((node as Commune).departement) {
    return (
      <CardHeader title={ `${ node.name } ${ (node as Commune).zipCode ? `(${ (node as Commune).zipCode })` : '' }` }
                  action={ <IconButton onClick={ onClose }><Close/></IconButton> }/>
    )
  } else if ((node as Departement).region) {
    return (
      <CardHeader title={ `${ node.name } (${ node.id })` }
                  action={ <IconButton onClick={ onClose }><Close/></IconButton> }/>
    )
  } else if ((node as Region).departements) {
    return (
      <CardHeader title={ node.name } action={ <IconButton onClick={ onClose }><Close/></IconButton> }/>
    )
  } else {
    return <></>
  }
}

export default DialogHeader;

