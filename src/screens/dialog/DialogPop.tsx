import { CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, YAxisProps } from 'recharts';

interface YearDialogPopProps {
  data: Array<any>;
  legend?: string;
  tooltip?: React.ReactNode;
  yAxis?: Array<YAxisProps>;
  lines?: Array<any>;
}

function YearDialogPop({ data, legend, tooltip, yAxis = [{ dataKey: 'pop' }], lines = [{ dataKey: 'pop' }] }: YearDialogPopProps) {
  const intl = useIntl();

  return (
    <CardContent>
      <Grid container style={ { alignItems: 'center', justifyContent: 'center' } }>
        <Grid container item xs={ 12 }>
          <AutoSizer disableHeight>
            { ({ width }: HorizontalSize) =>
              <Grid container item flexDirection='column' rowGap={ 2 } style={ { width: 'fit-content' } }>
                {
                  legend && (
                    <Typography variant='h6' style={ { textAlign: 'center' } }>
                      <FormattedMessage id={ legend }/>
                    </Typography>
                  ) }
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
                  {
                    yAxis &&
                    yAxis.map(v => <YAxis tickFormatter={ (value) => intl.formatNumber(value) } allowDecimals={ false } { ...v } />)
                  }
                  {
                    tooltip && (
                      tooltip
                    )
                  }
                  {
                    lines &&
                    lines.map(
                      v => <Line type='bumpX' stroke='#8884d8' connectNulls strokeWidth={ 2 } activeDot={ { r: 6 } } isAnimationActive={ false } { ...v }/>)
                  }
                </LineChart>
              </Grid>
            }
          </AutoSizer>
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default YearDialogPop;

