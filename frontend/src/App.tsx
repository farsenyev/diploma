import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import {HistoryPage} from "./pages/HistoryPage.tsx";
import {HistoryDetailsPage} from "./pages/HistoryDetailsPage.tsx";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/history" element={<HistoryPage/>} />
                <Route path="/history/:id" element={<HistoryDetailsPage/>} />
            </Routes>
        </BrowserRouter>
    );
};
