import { Divider, Tab, Tabs } from '@mui/material';
import { Breakpoint } from '@mui/system';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import CommuneDialogHeader from 'screens/dialog/CommuneDialogHeader';
import CommuneDialogInfo from 'screens/dialog/CommuneDialogInfo';
import CommuneDialogPop from 'screens/dialog/CommuneDialogPop';
import DepartementDialogHeader from 'screens/dialog/DepartementDialogHeader';
import RegionDialogHeader from 'screens/dialog/RegionDialogHeader';
import RegionDialogPopRank from 'screens/dialog/RegionDialogPopRank';
import { Commune, Departement, Level, Region } from 'types/api.types';
import DepartementDialogInfo from './DepartementDialogInfo';
import DepartementDialogPop from './DepartementDialogPop';
import RegionDialogInfo from './RegionDialogInfo';
import RegionDialogPop from './RegionDialogPop';

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
        <Tabs value={ tab } onChange={ (event, value) => setTab(value) } variant='scrollable'>
          <Tab label={ <FormattedMessage id='commune.tab.0'/> } wrapped />
          <Tab label={ <FormattedMessage id='commune.tab.1'/> } wrapped />
          <Tab label={ <FormattedMessage id='commune.tab.2'/> } wrapped />
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
          <>
            {
              tab === 0 && (
                <DepartementDialogInfo departement={ data as Departement } setMaxWidth={ setMaxWidth }/>
              )
            }
            {
              tab === 1 && (
                <DepartementDialogPop departement={ data as Departement } setMaxWidth={ setMaxWidth }/>
              )
            }
          </>
        )
      }
        {
          data.level === Level.REGION && (
            <>
              {
                tab === 0 && (
                  <RegionDialogInfo region={ data as Region } setMaxWidth={ setMaxWidth }/>
                )
              }
              {
                tab === 1 && (
                  <RegionDialogPop region={ data as Region } setMaxWidth={ setMaxWidth }/>
                )
              }
              {
                tab === 2 && (
                  <RegionDialogPopRank region={ data as Region } setMaxWidth={ setMaxWidth }/>
                )
              }
            </>
          )
        }
    </>
  );
}

export default DataDialog;

