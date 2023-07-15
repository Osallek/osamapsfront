import { Divider, Tab, Tabs } from '@mui/material';
import { Breakpoint } from '@mui/system';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import CommuneDialogHeader from 'screens/dialog/CommuneDialogHeader';
import CommuneDialogInfo from 'screens/dialog/CommuneDialogInfo';
import CommuneDialogPop from 'screens/dialog/CommuneDialogPop';
import DepartementDialog from 'screens/dialog/DepartementDialog';
import DepartementDialogHeader from 'screens/dialog/DepartementDialogHeader';
import RegionDialog from 'screens/dialog/RegionDialog';
import RegionDialogHeader from 'screens/dialog/RegionDialogHeader';
import { Commune, Departement, Level, Region } from 'types/api.types';

interface DataDialogProps {
  data: Commune | Departement | Region;
  onClose?: () => void;
  setMaxWidth?: (m: Breakpoint | false | undefined) => void;
}

function DataDialog({ data, onClose, setMaxWidth }: DataDialogProps) {
  const [tab, setTab] = useState<number>(0);

  return (
    <>
      {
        data.level === Level.COMMUNE && (
          <CommuneDialogHeader commune={ data as Commune } onClose={ onClose }/>
        )
      }
      {
        data.level === Level.DEPARTEMENT && (
          <DepartementDialogHeader departement={ data as Departement } onClose={ onClose }/>
        )
      }
      {
        data.level === Level.REGION && (
          <RegionDialogHeader region={ data as Region } onClose={ onClose }/>
        )
      }
      <Divider/>
      <Tabs value={ tab } onChange={ (event, value) => setTab(value) } aria-label="basic tabs example">
        <Tab label={ <FormattedMessage id='commune.tab.0'/> }/>
        <Tab label={ <FormattedMessage id='commune.tab.1'/> }/>
      </Tabs>
      {
        data.level === Level.COMMUNE && (
          <>
            {
              tab === 0 && (
                <CommuneDialogInfo commune={ data as Commune } setMaxWidth={ setMaxWidth }/>
              )
            }
            {
              tab === 1 && (
                <CommuneDialogPop commune={ data as Commune } setMaxWidth={ setMaxWidth }/>
              )
            }
          </>
        )
      }
      {
        data.level === Level.DEPARTEMENT && (
          <DepartementDialog departement={ data as Departement } onClose={ onClose }/>
        )
      }
      {
        data.level === Level.REGION && (
          <RegionDialog region={ data as Region } onClose={ onClose }/>
        )
      }
    </>
  );
}

export default DataDialog;

