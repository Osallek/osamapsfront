import { CardContent, Grid, Typography } from '@mui/material';
import { Breakpoint } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import DialogPop from 'screens/dialog/DialogPop';
import { Departement } from 'types/api.types';
import { popLine } from 'utils/chart.utils';

interface DepartementDialogPopProps {
  departement: Departement;
  setMaxWidth?: (m: Breakpoint | false | undefined) => void;
}

function DepartementDialogPop({ departement, setMaxWidth }: DepartementDialogPopProps) {
  const intl = useIntl();
  const [data, setData] = useState<Array<any>>([]);

  if (setMaxWidth) {
    setMaxWidth('xl');
  }

  useEffect(() => {
    setData(popLine(departement));
  }, [departement]);

  return (
    <DialogPop data={ data } legend='common.pop.history'
               tooltip={ <Tooltip content={ ({ active, payload, label }) => {
                 return active ? (
                   <div>
                     { `${ label } : ${ payload ? payload[0].value : '' }` }
                   </div>
                 ) : undefined;
               } }/> }/>
  );
}

export default DepartementDialogPop;

