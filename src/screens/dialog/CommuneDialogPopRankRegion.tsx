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
  const [nbCommunes, setNbCommunes] = useState<number>(0);
  const data = useContext(DataContext);

  useEffect(() => {
    if (data) {
      const region = data.departements.departements[commune.departement].region;
      setNbCommunes(
        Object.values(data.departements.departements).filter(d => d.region === region).reduce((accumulator, d) => accumulator + d.communes.length, 0));
    }

    setDatas(popRankLine([commune.population.regionRanks]));
  }, [commune]);

  if (!data) {
    return <></>;
  }

  if (setMaxWidth) {
    setMaxWidth('xl');
  }

  return (
    <DialogPop data={ datas }
               yAxis={ [{ dataKey: 'data0', key: '0', domain: [1, nbCommunes] }] }
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

