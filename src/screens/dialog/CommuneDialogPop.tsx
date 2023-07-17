import { CardContent, Grid, Typography } from '@mui/material';
import { Breakpoint } from '@mui/system';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Commune } from 'types/api.types';
import { popLine } from 'utils/chart.utils';

interface CommuneContentPopProps {
  commune: Commune;
  setMaxWidth?: (m: Breakpoint | false | undefined) => void;
}

function CommuneDialogPop({ commune, setMaxWidth }: CommuneContentPopProps) {
  const [data, setData] = useState<Array<any>>([]);

  if (setMaxWidth) {
    setMaxWidth('xl');
  }

  useEffect(() => {
    setData(popLine(commune));
  }, [commune]);

  return (
    <CardContent>
      <Grid container style={ { alignItems: 'center', justifyContent: 'center' } }>
        <Grid container item xs={ 12 }>
          <AutoSizer disableHeight>
            { ({ width }: HorizontalSize) =>
              <Grid container item flexDirection='column' rowGap={ 2 } style={ { width: 'fit-content' } }>
                <Typography variant='h6' style={ { textAlign: 'center' } }>
                  <FormattedMessage id='common.pop.history'/>
                </Typography>
                <LineChart
                  width={ width }
                  height={ 500 }
                  data={ data }
                  margin={ {
                    top: 5,
                    right: 40,
                    left: 20,
                    bottom: 5,
                  } }
                >
                  <CartesianGrid strokeDasharray='3 3'/>
                  <XAxis dataKey='year' type='number' domain={ ['dataMin', 'dataMax'] } ticks={ data.map(v => v.year) }/>
                  <YAxis dataKey='pop'/>
                  <Tooltip content={ ({ active, payload, label }) => {
                    return active ? (
                      <div>
                        { `${ label } : ${ payload ? payload[0].value : '' }` }
                      </div>
                    ) : undefined;
                  } }/>
                  <Line type='bumpX' dataKey='pop' stroke='#8884d8' connectNulls strokeWidth={ 2 } activeDot={ { r: 6 } } isAnimationActive={ false }/>
                </LineChart>
              </Grid>
            }
          </AutoSizer>
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default CommuneDialogPop;

