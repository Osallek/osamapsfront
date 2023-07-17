import { Breakpoint } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from 'recharts';
import DialogPop from 'screens/dialog/DialogPop';
import { DataContext } from 'screens/map/MapPage';
import { Region } from 'types/api.types';
import { popRankLine } from 'utils/chart.utils';

interface RegionDialogPopRankProps {
  region: Region;
  setMaxWidth?: (m: Breakpoint | false | undefined) => void;
}

function RegionDialogPopRank({ region, setMaxWidth }: RegionDialogPopRankProps) {
  const [datas, setDatas] = useState<Array<any>>([]);
  const data = useContext(DataContext);

  useEffect(() => {
    setDatas(popRankLine([region.population.countryRanks]));
  }, [region]);

  if (!data) {
    return <></>;
  }

  if (setMaxWidth) {
    setMaxWidth('xl');
  }

  return (
    <DialogPop data={ datas } yAxis={ [{ dataKey: 'data0', domain: [1, Object.values(data.regions.regions).length] }] }
               lines={ [{ dataKey: 'data0' }] }
               tooltip={ <Tooltip content={ ({ active, payload, label }) => {
                 return active && payload && payload.length > 0 ? (
                   <div>
                     { `${ label } : ${ payload ? payload[0].value : '' }` }
                   </div>
                 ) : undefined;
               } }/> }/>
  );
}

export default RegionDialogPopRank;

