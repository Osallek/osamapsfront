import { Autocomplete, Card, CardContent, Grid, Popper, TextField, Typography } from '@mui/material';
import { PopperProps } from '@mui/material/Popper';
import { addressApi } from 'api/api';
import { debounce } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { AddressFeature, AddressType, Point } from 'types/api.types';

const SearchPopper = (props: PopperProps, nbOptions: number) => {
  return <Popper { ...props } sx={ { width: 'fit-content !important' } } placement="bottom-start"/>;
};

interface MenuSearchProps {
  onChange: (commune: Point | undefined, type: AddressType | undefined) => void;
}

function MenuSearch({ onChange }: MenuSearchProps) {
  const [value, setValue] = React.useState<AddressFeature | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly AddressFeature[]>([]);

  const fetch = React.useMemo(
    () =>
      debounce(async (q: string) => {
        try {
          const { data } = await addressApi.search(q);

          setOptions(data.features);
        } catch (e) {
        }
      }, 400), []);

  React.useEffect(() => {
    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(inputValue);
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      sx={ { mb: 1, mt: 1, minWidth: 230 } }
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      disableListWrap
      autoComplete
      includeInputInList
      filterSelectedOptions
      options={ options }
      value={ value }
      noOptionsText={ <FormattedMessage id="common.notFound"/> }
      getOptionLabel={ (option) => option.properties.label }
      isOptionEqualToValue={ (option, v) => option.properties.id === v.properties.id }
      filterOptions={ (x) => x }
      renderInput={ (params) => <TextField { ...params } label={ <FormattedMessage id="common.search"/> }/> }
      onChange={ (event: any, newValue: AddressFeature | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        onChange(
          newValue ? {
            lat: newValue.geometry.coordinates[1], lon: newValue.geometry.coordinates[0]
          } : undefined, newValue ? newValue.properties.type : undefined);
      } }
      onInputChange={ (event, newInputValue) => {
        setInputValue(newInputValue);
      } }
      renderOption={ (props, option) => {
        return (
          <li { ...props } style={ { ...props.style, backgroundColor: 'transparent' } }>
            <Card elevation={ 0 } sx={ { flex: 'none', p: 0, width: '100%' } }>
              <CardContent sx={ { p: 1, pb: '4px !important' } }>
                <Grid container sx={ { justifyContent: 'space-between' } }>
                  <Grid container item xs={ 9 } sx={ { flexDirection: 'column' } }>
                    <Grid item>
                      <Typography variant="h6">
                        { option.properties.label }
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" sx={ { color: 'rgba(0, 0, 0, 0.6)' } }>
                        { option.properties.context }
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={ 3 } sx={ { alignContent: 'center', justifyContent: 'flex-end' } }>
                    <Typography variant="body2" sx={ { textAlign: 'end', color: 'rgba(0, 0, 0, 0.6)' } }>
                      <FormattedMessage id={ `common.address.type.${ option.properties.type }` }/>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </li>
        );
      } }
      PopperComponent={ props => SearchPopper(props, options.length) }
    />
  );
}

export default MenuSearch;

