import { Card, CardContent, CardHeader, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Tooltip } from 'recharts';
import CommuneDialogInfo from 'screens/dialog/CommuneDialogInfo';
import DepartementDialogInfo from 'screens/dialog/DepartementDialogInfo';
import DialogHeader from 'screens/dialog/DialogHeader';
import DialogLine from 'screens/dialog/DialogLine';
import DialogRank from 'screens/dialog/DialogRank';
import DialogStack from 'screens/dialog/DialogStack';
import RegionDialogInfo from 'screens/dialog/RegionDialogInfo';
import { Commune, Departement, Level, Region } from 'types/api.types';
import { DataLevel } from 'types/maps.types';
import {
  birthDeathLine, birthDeathRank, densityLine, percentBars, percentData, popLine, recordLine
} from 'utils/chart.utils';

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
      <Tabs value={ tab } onChange={ (event, value) => setTab(value) } variant="scrollable">
        <Tab label={ <FormattedMessage id="view.tab.0"/> } wrapped/>
        <Tab label={ <FormattedMessage id="view.tab.1"/> } wrapped/>
        <Tab label={ <FormattedMessage id="view.tab.2"/> } wrapped/>
        <Tab label={ <FormattedMessage id="view.tab.3"/> } wrapped/>
        <Tab label={ <FormattedMessage id="view.tab.4"/> } wrapped/>
        <Tab label={ <FormattedMessage id="view.tab.5"/> } wrapped/>
        <Tab label={ <FormattedMessage id="view.tab.6"/> } wrapped/>
        <Tab label={ <FormattedMessage id="view.tab.7"/> } wrapped/>
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
          <DialogRank node={ data as Region }
                      mapper={ (level, node, data1) => recordLine(DataLevel.getRank(level, node)) }
                      lengthMapper={ (level, node, data1) => DataLevel.getRankLength(level, node, data1) }/>
        )
      }
      {
        tab === 3 && (
          <DialogLine node={ data } mapper={ node => densityLine(node) }/>
        )
      }
      { tab === 4 && (
        <DialogRank node={ data } mapper={ (level, node, data1) => recordLine(DataLevel.getDensityRank(level, node)) }
                    lengthMapper={ (level, node, data1) => DataLevel.getRankLength(level, node, data1) }/>
      )
      }
      {
        tab === 5 && (
          <DialogStack node={ data } mapper={ (level, node, data) => percentData(node, level) }
                       barsMapper={ (level, node, data1, colors) => percentBars() }/>
        )
      }
      {
        tab === 6 && (
          <DialogLine node={ data } mapper={ node => birthDeathLine(node) } yAxis={ [{ dataKey: 'birth' }] }
                      lines={ [{ dataKey: 'birth', stroke: '#82CA9D' }, { dataKey: 'death', stroke: '#DA1D1D' }] }
                      tooltip={ <Tooltip content={ ({ active, payload, label }) => {
                        if (!active || !payload || payload.length <= 0) {
                          return undefined;
                        }

                        return (
                          <Card>
                            <CardHeader title={ payload[0].payload.year } sx={ { paddingBottom: 0 } }/>
                            <CardContent>
                              <Grid container flexDirection="column">
                                <Grid item>
                                  <Typography variant="body1" component="span"
                                              sx={ { fontWeight: 'bold', color: '#82CA9D' } }>
                                    <FormattedMessage id="view.births"/>
                                    { ` : ` }
                                  </Typography>
                                  <Typography variant="body2" component="span">
                                    <FormattedNumber value={ Number(payload[0].value) }/>
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="body1" component="span"
                                              sx={ { fontWeight: 'bold', color: '#DA1D1D' } }>
                                    <FormattedMessage id="view.deaths"/>
                                    { ` : ` }
                                  </Typography>
                                  <Typography variant="body2" component="span">
                                    <FormattedNumber value={ Number(payload[1].value) }/>
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="body1" component="span"
                                              sx={ { fontWeight: 'bold', color: '#8884d8' } }>
                                    <FormattedMessage id="view.diff"/>
                                    { ` : ` }
                                  </Typography>
                                  <Typography variant="body2" component="span">
                                    <FormattedNumber value={ Number(payload[0].value) - Number(payload[1].value) }
                                                     signDisplay="exceptZero"/>
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        );

                      } }/> }/>
        )
      }
      {
        tab === 7 && (
          <DialogRank node={ data } mapper={ (level, node, data1) => birthDeathRank(level, node) }
                      lengthMapper={ (level, node, data1) => DataLevel.getRankLength(level, node, data1) }
                      lines={ [{ dataKey: 'birth', stroke: '#82CA9D' }, { dataKey: 'death', stroke: '#DA1D1D' }] }
                      yAxis={ length => [{ dataKey: 'birth', domain: [1, length] }] }
                      tooltip={ <Tooltip content={ ({ active, payload, label }) => {
                        if (!active || !payload || payload.length <= 0) {
                          return undefined;
                        }

                        return (
                          <Card>
                            <CardHeader title={ payload[0].payload.year } sx={ { paddingBottom: 0 } }/>
                            <CardContent>
                              <Grid container flexDirection="column">
                                <Grid item>
                                  <Typography variant="body1" component="span"
                                              sx={ { fontWeight: 'bold', color: '#82CA9D' } }>
                                    <FormattedMessage id="view.births"/>
                                    { ` : ` }
                                  </Typography>
                                  <Typography variant="body2" component="span">
                                    <FormattedNumber value={ Number(payload[0].value) }/>
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="body1" component="span"
                                              sx={ { fontWeight: 'bold', color: '#DA1D1D' } }>
                                    <FormattedMessage id="view.deaths"/>
                                    { ` : ` }
                                  </Typography>
                                  <Typography variant="body2" component="span">
                                    <FormattedNumber value={ Number(payload[1].value) }/>
                                  </Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        );

                      } }/> }/>
        )
      }
    </>
  );
}

export default DataDialog;

