import {useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultDashboard } from '../components/dashboard/ResultDashboard';
import { ResultTable } from '../components/table/ResultTable';
import type { AnalysisReport, AnalyzeResponse } from '../types';
import {Loader} from "../components/loader/Loader";
import {saveAnalysisToHistory} from "../services/historyStore.ts";
import "./style/ResultPage.css"

export const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const url = location.state?.url as string;

    const [report, setReport] = useState<AnalysisReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const hasRequestedRef = useRef(false);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('http://localhost:3001/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data: AnalyzeResponse = await response.json();

            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`)
            }

            setReport(data.report);
            await saveAnalysisToHistory(url, data)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!url) {
            setError('URL не передан');
            setLoading(false);
            return;
        }

        if (hasRequestedRef.current) return;

        hasRequestedRef.current = true;

        fetchAnalysis();
    }, [url]);

    if (loading) {
        return (
            <main className="page">
                <Loader message="Формируется модель визуальной структуры страницы..." />
            </main>
        );
    }

    if (error) {
        return (
            <main className="page">
                <div className="results-state results-state-error">
                    <p>{error}</p>

                    <button type="button" onClick={() => navigate('/')}>
                        Вернуться назад
                    </button>
                </div>
            </main>
        );
    }

    if (!report) {
        return (
            <main className="page">
                <div className="results-state">
                    <p>Результаты анализа отсутствуют.</p>

                    <button type="button" onClick={() => navigate('/')}>
                        Вернуться назад
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            <div className="results-page-header">
                <div>
                    <h1>Результаты анализа</h1>
                    <p className="results-page-url">{url}</p>
                </div>

                <button type="button" onClick={() => navigate('/')}>
                    Новая проверка
                </button>
            </div>

            <ResultDashboard report={report} />
            <ResultTable results={report.results} />
        </main>
    );
};