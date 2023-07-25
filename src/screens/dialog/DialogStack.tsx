import { Card, CardContent, CardHeader, Grid, MenuItem, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Tooltip } from 'recharts';
import YearBar from 'screens/dialog/YearBar';
import { DataContext } from 'screens/map/MapPage';
import { Api, Commune, CommunePopulations, Departement, DepartementPopulations, Region } from 'types/api.types';
import { DataLevel } from 'types/maps.types';
import { getDataGradient } from 'utils/colors.utils';

interface DialogRankProps {
  node: Region | Departement | Commune;
  mapper: (level: DataLevel, node: Region | Departement | Commune, data: Api) => Array<any>;
  barsMapper: (level: DataLevel, node: Region | Departement | Commune, data: Api, colors: Array<string>) => Array<any>;
}

function DialogStack({ node, mapper, barsMapper }: DialogRankProps) {
  const [datas, setDatas] = useState<Array<any>>([]);
  const [bars, setBars] = useState<Array<any>>([]);
  const [level, setLevel] = useState<DataLevel>(DataLevel.COUNTRY);
  const [levels, setLevels] = useState<Array<DataLevel>>([]);
  const data = useContext(DataContext);

  useEffect(() => {
    const l: Array<DataLevel> = [DataLevel.COUNTRY];

    if (node.population && (node.population as DepartementPopulations).regionRanks) {
      l.push(DataLevel.REGION);
    }

    if (node.population && (node.population as CommunePopulations).departementRanks) {
      l.push(DataLevel.DEPARTEMENT);
    }

    setLevels(l);
  }, [node]);

  useEffect(() => {
    if (levels.indexOf(level) < 0) {
      setLevel(DataLevel.COUNTRY);
    }
  }, [levels]);

  useEffect(() => {
    if (data) {
      setDatas(mapper.call(undefined, level, node, data));
      setBars(barsMapper.call(undefined, level, node, data, getDataGradient(node)));
    }
  }, [node, level]);

  if (!data) {
    return <></>;
  }

  return (
    <>
      {
        levels.length > 1 && (
          <TextField sx={ { margin: 2, minWidth: 150, width: 'fit-content' } }
                     value={ level }
                     onChange={ event => setLevel(event.target.value as DataLevel) }
                     select
                     label={ <FormattedMessage id="view.stack"/> }
          >
            {
              levels.map(
                v => <MenuItem value={ v } key={ v }><FormattedMessage id={ `view.dataLevel.${ v }e` }/></MenuItem>)
            }
          </TextField>
        )
      }
      <YearBar data={ datas } yAxis={ [{ dataKey: 'pop', domain: [0, 100] }] } bars={ bars }
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
                           <Typography variant="body1" component="span" sx={ { fontWeight: 'bold' } }>
                             { `${ payload[0].payload.name } : ` }
                           </Typography>
                           <Typography variant="body2" component="span">
                             <FormattedNumber value={ Number(payload[0].value) }/>%
                           </Typography>
                         </Grid>
                         <Grid item>
                           <Typography variant="body1" component="span" sx={ { fontWeight: 'bold' } }>
                             <FormattedMessage id="view.others"/>
                             { ` : ` }
                           </Typography>
                           <Typography variant="body2" component="span">
                             <FormattedNumber value={ Number(payload[1].value) }/>%
                           </Typography>
                         </Grid>
                       </Grid>
                     </CardContent>
                   </Card>
                 );

               } }/> }/>
    </>
  );
}

export default DialogStack;

