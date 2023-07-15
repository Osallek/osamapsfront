import { Button, Card, CardActions } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import CommunePopUp from 'screens/popup/CommunePopUp';
import DepartementPopUp from 'screens/popup/DepartementPopUp';
import RegionPopUp from 'screens/popup/RegionPopUp';
import { Commune, Departement, Level, Region } from 'types/api.types';

interface DataPopupProps {
  data: Commune | Departement | Region;
  onClose?: () => void;
  onClick?: () => void;
}

function DataPopup({ data, onClose, onClick }: DataPopupProps) {
  return (
    <Card sx={ { minWidth: 400 } }>
      {
        data.level === Level.COMMUNE && (
          <CommunePopUp commune={ data as Commune } onClose={ onClose }/>
        )
      }
      {
        data.level === Level.DEPARTEMENT && (
          <DepartementPopUp departement={ data as Departement } onClose={ onClose }/>
        )
      }
      {
        data.level === Level.REGION && (
          <RegionPopUp region={ data as Region } onClose={ onClose }/>
        )
      }
      <CardActions sx={ { justifyContent: 'center' } }>
        <Button variant='contained' onClick={ onClick }><FormattedMessage id='common.viewMore'/></Button>
      </CardActions>
    </Card>
  );
}

export default DataPopup;

