import { Box } from "@mui/material";

import * as React from "react";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<Props> = ({ children }) => {
  return (
    <Box sx={ { height: '100vh' } }>
      { children }
    </Box>
  );
};

export default DefaultLayout;
