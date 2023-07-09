import { Card } from '@mui/material';
import CommuneContent from 'screens/popup/CommuneContent';
import DepartementContent from 'screens/popup/DepartementContent';
import RegionContent from 'screens/popup/RegionContent';
import { Commune, Departement, Level, Region } from 'types/api.types';

interface DataPopupProps {
  data: Commune | Departement | Region;
  onClose?: () => void;
}

function DataPopup({ data, onClose }: DataPopupProps) {
  return (
    <Card sx={ { minWidth: 400 } }>
      {
        data.level === Level.COMMUNE && (
          <CommuneContent commune={ data as Commune } onClose={ onClose }/>
        )
      }
      {
        data.level === Level.DEPARTEMENT && (
          <DepartementContent departement={ data as Departement } onClose={ onClose }/>
        )
      }
      {
        data.level === Level.REGION && (
          <RegionContent region={ data as Region } onClose={ onClose }/>
        )
      }
    </Card>
  );
}

export default DataPopup;

