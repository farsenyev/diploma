import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StoredAnalysis } from '../types';
import {clearHistory, deleteAnalysisById, getHistoryList,} from '../services/historyStore';
import './style/HistoryPage.css'

export const HistoryPage = () => {
    const [items, setItems] = useState<StoredAnalysis[]>([]);
    const navigate = useNavigate();

    const loadHistory = async () => {
        const data = await getHistoryList();
        setItems(data);
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleOpen = (id: string) => {
        navigate(`/history/${id}`);
    };

    const handleDelete = async (id: string) => {
        await deleteAnalysisById(id);
        await loadHistory();
    };

    const handleClear = async () => {
        await clearHistory();
        await loadHistory();
    };

    return (
        <main className="page">
            <div className="results-page-header">
                <div>
                    <h1>История проверок</h1>
                    <p className="results-page-url">Сохранённые результаты анализа</p>
                </div>

                <div className="history-header-actions">
                    <button type="button" onClick={() => navigate('/')}>
                        На главную
                    </button>

                    <button type="button" onClick={handleClear}>
                        Очистить историю
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="history-empty">
                    <p>История проверок пока пуста.</p>
                    <button type="button" onClick={() => navigate('/')}>
                        Перейти к проверке
                    </button>
                </div>
            ) : (
                <div className="history-list">
                    {items.map((item) => (
                        <div key={item.id} className="history-card">
                            <div className="history-card-top">
                                <div className="history-url">{item.url}</div>
                                <div className={`history-grade grade-${item.report.grade.toLowerCase()}`}>
                                    {item.report.grade}
                                </div>
                            </div>

                            <div className="history-meta">
                                <span>Score: {item.report.score}</span>
                                <span>Errors: {item.report.summary.errors}</span>
                                <span>Warnings: {item.report.summary.warnings}</span>
                                <span>OK: {item.report.summary.ok}</span>
                            </div>

                            <div className="history-date">
                                {new Date(item.createdAt).toLocaleString()}
                            </div>

                            <div className="history-actions">
                                <button type="button" onClick={() => handleOpen(item.id)}>
                                    Открыть
                                </button>

                                <button
                                    type="button"
                                    className="history-remove-btn"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};