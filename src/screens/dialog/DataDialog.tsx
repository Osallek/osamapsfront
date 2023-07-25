import { Divider, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import CommuneDialogInfo from 'screens/dialog/CommuneDialogInfo';
import DepartementDialogInfo from 'screens/dialog/DepartementDialogInfo';
import DialogHeader from 'screens/dialog/DialogHeader';
import DialogLine from 'screens/dialog/DialogLine';
import DialogRank from 'screens/dialog/DialogRank';
import DialogStack from 'screens/dialog/DialogStack';
import RegionDialogInfo from 'screens/dialog/RegionDialogInfo';
import { Commune, Departement, Level, Region } from 'types/api.types';
import { DataLevel } from 'types/maps.types';
import { densityLine, percentBars, percentData, popLine, recordLine } from 'utils/chart.utils';

interface DataDialogProps {
  data: Commune | Departement | Region;
  onClose?: () => void;
}

function DataDialog({ data, onClose }: DataDialogProps) {
  const [tab, setTab] = useState<number>(0);

  return (
    <>
      <DialogHeader node={ data } onClose={ onClose }/>
      <Divider/>
      <Tabs value={ tab } onChange={ (event, value) => setTab(value) } variant='scrollable'>
        <Tab label={ <FormattedMessage id='view.tab.0'/> } wrapped/>
        <Tab label={ <FormattedMessage id='view.tab.1'/> } wrapped/>
        <Tab label={ <FormattedMessage id='view.tab.2'/> } wrapped/>
        <Tab label={ <FormattedMessage id='view.tab.3'/> } wrapped/>
        <Tab label={ <FormattedMessage id='view.tab.4'/> } wrapped/>
        <Tab label={ <FormattedMessage id='view.tab.5'/> } wrapped/>
      </Tabs>
      {
        tab === 0 && (
          <>
            {
              data.level === Level.COMMUNE && (
                <CommuneDialogInfo commune={ data as Commune }/>
              )
            }
            {
              data.level === Level.DEPARTEMENT && (
                <DepartementDialogInfo departement={ data as Departement }/>
              )
            }
            {
              data.level === Level.REGION && (
                <RegionDialogInfo region={ data as Region }/>
              )
            }
          </>
        )
      }
      {
        tab === 1 && (
          <DialogLine node={ data } mapper={ node => popLine(node) }/>
        )
      }
      {
        tab === 2 && (
          <DialogRank node={ data as Region } mapper={ (level, node, data1) => recordLine(DataLevel.getRank(level, node)) }
                      lengthMapper={ (level, node, data1) => DataLevel.getRankLength(level, node, data1) }/>
        )
      }
      {
        tab === 3 && (
          <DialogLine node={ data } mapper={ node => densityLine(node) }/>
        )
      }
      { tab === 4 && (
        <DialogRank node={ data as Region } mapper={ (level, node, data1) => recordLine(DataLevel.getDensityRank(level, node)) }
                    lengthMapper={ (level, node, data1) => DataLevel.getRankLength(level, node, data1) }/>
      )
      }
      {
        tab === 5 && (
          <DialogStack node={ data } mapper={ (level, node, data) => percentData(node, level) }
                       barsMapper={ (level, node, data1, colors) => percentBars() }/>
        )
      }
    </>
  );
}

export default DataDialog;

