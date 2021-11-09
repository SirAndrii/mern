import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { CreatePage } from './pages/CreatePage';
import { DetailPage } from './pages/DetailPage';
import { LinksPage } from "./pages/LinksPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated){
        return(
            <Routes>
                <Route path ="/links" exact>
                    <LinksPage />
                </Route>
                <Route path ="/create" exact>
                    <CreatePage />
                </Route>
                <Route path ="/detail/:id">
                    <DetailPage />
                </Route>
                <Navigate to="/create" />
            </Routes>
        )
    }

    return(
        <Routes>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Navigate to="/" />
        </Routes>
    )
}