import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResultDashboard } from '../components/dashboard/ResultDashboard';
import { ResultTable } from '../components/table/ResultTable';
import { getAnalysisById } from '../services/historyStore';
import type { StoredAnalysis } from '../types';
import './style/HistoryDetailsPage.css'

export const HistoryDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<StoredAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            const data = await getAnalysisById(id);
            setItem(data ?? null);
            setLoading(false);
        };

        load();
    }, [id]);

    if (loading) {
        return <main className="page"><div className="results-state">Загрузка сохранённого отчёта...</div></main>;
    }

    if (!item) {
        return (
            <main className="page">
                <div className="results-state results-state-error">
                    <p>Сохранённый отчёт не найден.</p>
                    <button type="button" onClick={() => navigate('/history')}>
                        Назад
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            <div className="results-page-header">
                <div>
                    <h1>Сохранённый отчёт</h1>
                    <p className="results-page-url">{item.url}</p>
                </div>

                <div className="history-header-actions">
                    <button type="button" onClick={() => navigate('/')}>
                        На главную
                    </button>
                    <button type="button" onClick={() => navigate('/history')}>
                        Назад к истории
                    </button>
                </div>
            </div>

            <ResultDashboard report={item.report} />
            <ResultTable results={item.report.results} />
        </main>
    );
};