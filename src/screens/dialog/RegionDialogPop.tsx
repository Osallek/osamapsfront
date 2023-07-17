import { Breakpoint } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'recharts';
import DialogPop from 'screens/dialog/DialogPop';
import { Region } from 'types/api.types';
import { popLine } from 'utils/chart.utils';

interface RegionDialogPopProps {
  region: Region;
  setMaxWidth?: (m: Breakpoint | false | undefined) => void;
}

function RegionDialogPop({ region, setMaxWidth }: RegionDialogPopProps) {
  const [data, setData] = useState<Array<any>>([]);

  if (setMaxWidth) {
    setMaxWidth('xl');
  }

  useEffect(() => {
    setData(popLine(region));
  }, [region]);

  return (
    <DialogPop data={ data }
               tooltip={ <Tooltip content={ ({ active, payload, label }) => {
                 return active ? (
                   <div>
                     { `${ label } : ${ payload ? payload[0].value : '' }` }
                   </div>
                 ) : undefined;
               } }/> }/>
  );
}

export default RegionDialogPop;

