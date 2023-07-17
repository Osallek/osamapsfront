import { Breakpoint } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import { Tooltip } from 'recharts';
import DialogPop from 'screens/dialog/DialogPop';
import { DataContext } from 'screens/map/MapPage';
import { Commune } from 'types/api.types';
import { popRankLine } from 'utils/chart.utils';

interface CommuneDialogPopRankProps {
  commune: Commune;
  setMaxWidth?: (m: Breakpoint | false | undefined) => void;
}

function CommuneDialogPopRank({ commune, setMaxWidth }: CommuneDialogPopRankProps) {
  const [datas, setDatas] = useState<Array<any>>([]);
  const data = useContext(DataContext);

  useEffect(() => {
    setDatas(popRankLine([commune.population.countryRanks]));
  }, [commune]);

  if (!data) {
    return <></>;
  }

  if (setMaxWidth) {
    setMaxWidth('xl');
  }

  return (
    <DialogPop data={ datas }
               yAxis={ [{ dataKey: 'data0', key: '0', domain: [1, Object.values(data.communes.communes).length] }] }
               lines={ [{ dataKey: 'data0' }] }
               tooltip={ <Tooltip content={ ({ active, payload, label }) => {
                 return active ? (
                   <div>
                     { `${ label } : ${ payload ? payload[0].value : '' }` }
                   </div>
                 ) : undefined;
               } }/> }/>
  );
}

export default CommuneDialogPopRank;

