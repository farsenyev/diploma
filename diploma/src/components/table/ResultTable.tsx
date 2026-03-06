import { useMemo, useState } from 'react';
import type { CheckStatus, ModuleCheckResult, PageSnapshot } from '../../types';
import { checkAll } from '../../services/modules/all/checkAll.ts';
import { Loader } from '../loading/Loader.tsx';
import './ResultTable.css';

interface ResultTableProps {
    url: string;
    results: ModuleCheckResult[];
    setResults: (results: ModuleCheckResult[]) => void;
}

type StatusFilter = 'all' | CheckStatus;

const STATUS_LABELS: Record<CheckStatus, string> = {
    ok: 'OK',
    warning: 'WARNING',
    error: 'ERROR',
};

export const ResultTable = ({
                                url,
                                results,
                                setResults,
                            }: ResultTableProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const summary = useMemo(
        () => ({
            all: results.length,
            ok: results.filter((item) => item.status === 'ok').length,
            warning: results.filter((item) => item.status === 'warning').length,
            error: results.filter((item) => item.status === 'error').length,
        }),
        [results]
    );

    const filteredResults = useMemo(() => {
        if (statusFilter === 'all') {
            return results;
        }

        return results.filter((item) => item.status === statusFilter);
    }, [results, statusFilter]);

    const handleCheckAll = async () => {
        if (!url.trim()) {
            setError('Введите корректный URL для проверки');
            return;
        }

        setLoading(true);
        setError('');
        setResults([]);
        setStatusFilter('all');

        try {
            const response = await fetch('http://localhost:3001/api/page-snapshot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка запроса к серверу: ${response.status}`);
            }

            const snapshot: PageSnapshot = await response.json();
            const checkedResults = await checkAll(snapshot);

            setResults(checkedResults);
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

    const renderSummaryButton = (
        filter: StatusFilter,
        label: string,
        count: number,
        extraClass = ''
    ) => (
        <button
            type="button"
            className={`summary-chip ${extraClass} ${statusFilter === filter ? 'active' : ''}`.trim()}
            onClick={() => setStatusFilter(filter)}
        >
            <span className="summary-chip-label">{label}</span>
            <span className="summary-chip-count">{count}</span>
        </button>
    );

    return (
        <section className="results-section">
            <div className="results-toolbar">
                <button
                    className="start-check"
                    onClick={handleCheckAll}
                    disabled={loading}
                >
                    {loading ? <Loader message="Checking..." /> : 'Start'}
                </button>
            </div>

            {error && <p className="results-error">{error}</p>}

            {results.length > 0 && (
                <>
                    <div className="results-summary">
                        {renderSummaryButton('all', 'ALL', summary.all, 'summary-all')}
                        {renderSummaryButton('ok', 'OK', summary.ok, 'summary-ok')}
                        {renderSummaryButton(
                            'warning',
                            'WARNING',
                            summary.warning,
                            'summary-warning'
                        )}
                        {renderSummaryButton(
                            'error',
                            'ERROR',
                            summary.error,
                            'summary-error'
                        )}
                    </div>

                    <div className="result-table-wrapper">
                        <table className="result-table">
                            <colgroup>
                                <col style={{ width: '22%' }} />
                                <col style={{ width: '30%' }} />
                                <col style={{ width: '34%' }} />
                                <col style={{ width: '14%' }} />
                            </colgroup>

                            <thead>
                            <tr>
                                <th>Модуль</th>
                                <th>Элемент</th>
                                <th>Проблема</th>
                                <th>Статус</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredResults.map((result, index) => (
                                <tr key={`${result.moduleName}-${result.item}-${index}`}>
                                    <td>
                                        <div className="cell-module">{result.moduleName}</div>
                                    </td>

                                    <td title={result.item}>
                                        <div className="cell-item">{result.item}</div>
                                    </td>

                                    <td title={result.issue}>
                                        <div className="cell-issue">{result.issue}</div>
                                    </td>

                                    <td>
                                      <span className={`status-badge status-${result.status}`}>
                                        {STATUS_LABELS[result.status]}
                                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {filteredResults.length === 0 && (
                            <div className="empty-filter-message">
                                Нет результатов для выбранного фильтра.
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};
