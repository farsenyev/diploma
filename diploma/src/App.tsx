import './App.css';
import { useMemo, useState } from 'react';
import type { ModuleCheckResult } from './types';
import { ResultTable } from './components/table/ResultTable.tsx';

export const App = () => {
    const [url, setUrl] = useState('');
    const [results, setResults] = useState<ModuleCheckResult[]>([]);

    const stats = useMemo(() => {
        return {
            total: results.length,
            ok: results.filter((item) => item.status === 'ok').length,
            warning: results.filter((item) => item.status === 'warning').length,
            error: results.filter((item) => item.status === 'error').length,
        };
    }, [results]);

    return (
        <main className="page">
            <section className="hero">
                <div className="hero-badge">Accessibility checker</div>

                <h1 className="page-title">Проверка доступности веб-страниц</h1>

                <p className="page-subtitle">
                    Демонстрационный сервис для анализа доступности интерфейсов.
                </p>

                <div className="hero-stats">
                    <div className="hero-stat-card">
                        <span className="hero-stat-value">{stats.total}</span>
                        <span className="hero-stat-label">Всего результатов</span>
                    </div>

                    <div className="hero-stat-card">
                        <span className="hero-stat-value hero-ok">{stats.ok}</span>
                        <span className="hero-stat-label">OK</span>
                    </div>

                    <div className="hero-stat-card">
                        <span className="hero-stat-value hero-warning">{stats.warning}</span>
                        <span className="hero-stat-label">Warning</span>
                    </div>

                    <div className="hero-stat-card">
                        <span className="hero-stat-value hero-error">{stats.error}</span>
                        <span className="hero-stat-label">Error</span>
                    </div>
                </div>
            </section>

            <section className="checker-section">
                <div className="checker-card">
                    <div className="checker-header">
                        <h2>Запуск проверки</h2>
                        <p>
                            Введите адрес страницы, которую нужно проанализировать, и запустите
                            проверку.
                        </p>
                    </div>

                    <input
                        className="input-url"
                        type="text"
                        placeholder="Введите URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <ResultTable url={url} setResults={setResults} results={results} />
                </div>
            </section>
        </main>
    );
}
