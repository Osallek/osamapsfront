import DefaultLayout from "layouts/Default";
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MapPage from 'screens/map/MapPage';

const AppRouter: React.FunctionComponent = () => {
  return (
    <DefaultLayout>
      <Suspense>
        <Routes>
          <Route path="*" element={ <MapPage/> }/>
        </Routes>
      </Suspense>
    </DefaultLayout>
  );
};

export default AppRouter;
