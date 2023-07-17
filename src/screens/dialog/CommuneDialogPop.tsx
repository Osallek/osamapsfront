import { CardContent, Grid, Typography } from '@mui/material';
import { Breakpoint } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import DialogPop from 'screens/dialog/DialogPop';
import { Commune } from 'types/api.types';
import { popLine } from 'utils/chart.utils';

interface CommuneContentPopProps {
  commune: Commune;
  setMaxWidth?: (m: Breakpoint | false | undefined) => void;
}

function CommuneDialogPop({ commune, setMaxWidth }: CommuneContentPopProps) {
  const intl = useIntl();
  const [data, setData] = useState<Array<any>>([]);

  if (setMaxWidth) {
    setMaxWidth('xl');
  }

  useEffect(() => {
    setData(popLine(commune));
  }, [commune]);

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

export default CommuneDialogPop;

