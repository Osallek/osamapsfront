import DefaultLayout from "layouts/Default";
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MainMap from 'screens/map/MainMap';

const AppRouter: React.FunctionComponent = () => {
  return (
    <DefaultLayout>
      <Suspense>
        <Routes>
          <Route path="*" element={ <MainMap/> }/>
        </Routes>
      </Suspense>
    </DefaultLayout>
  );
};

export default AppRouter;
