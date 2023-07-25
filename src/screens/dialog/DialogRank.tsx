import { MenuItem, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'recharts';
import YearLine from 'screens/dialog/YearLine';
import { DataContext } from 'screens/map/MapPage';
import { Api, Commune, CommunePopulations, Departement, DepartementPopulations, Region } from 'types/api.types';
import { DataLevel } from 'types/maps.types';

interface DialogRankProps {
  node: Region | Departement | Commune;
  mapper: (level: DataLevel, node: Region | Departement | Commune, data: Api) => Array<any>;
  lengthMapper: (level: DataLevel, node: Region | Departement | Commune, data: Api) => number;
}

function DialogRank({ node, mapper, lengthMapper }: DialogRankProps) {
  const [datas, setDatas] = useState<Array<any>>([]);
  const [length, setLength] = useState<number>(1);
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
      setLength(lengthMapper.call(undefined, level, node, data));
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
                     label={ <FormattedMessage id="view.rank"/> }
          >
            {
              levels.map(
                v => <MenuItem value={ v } key={ v }><FormattedMessage id={ `view.dataLevel.${ v }` }/></MenuItem>)
            }
          </TextField>
        )
      }
      <YearLine data={ datas } yAxis={ [{ dataKey: 'pop', domain: [1, length] }] }
                lines={ [{ dataKey: 'pop' }] }
                tooltip={ <Tooltip content={ ({ active, payload, label }) => {
                  return active && payload && payload.length > 0 ? (
                    <div>
                      { `${ label } : ${ payload ? payload[0].value : '' }` }
                    </div>
                  ) : undefined;
                } }/> }/>
    </>
  );
}

export default DialogRank;

