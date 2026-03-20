import { useMemo, useState } from 'react';
import type { CheckStatus, ModuleCheckResult } from '../../types';
import './ResultTable.css';

interface ResultTableProps {
    results: ModuleCheckResult[];
}

type StatusFilter = 'all' | CheckStatus;

const STATUS_LABELS: Record<CheckStatus, string> = {
    ok: 'OK',
    warning: 'WARNING',
    error: 'ERROR',
};

export const ResultTable = ({ results }: ResultTableProps) => {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [moduleFilter, setModuleFilter] = useState<string>('all');

    const summary = useMemo(
        () => ({
            all: results.length,
            ok: results.filter((item) => item.status === 'ok').length,
            warning: results.filter((item) => item.status === 'warning').length,
            error: results.filter((item) => item.status === 'error').length,
        }),
        [results]
    );

    const modules = useMemo(() => {
        const uniqueModules = Array.from(new Set(results.map((item) => item.moduleName)));
        return uniqueModules.sort();
    }, [results]);

    const filteredResults = useMemo(() => {
        return results.filter((item) => {
            const matchesStatus =
                statusFilter === 'all' ? true : item.status === statusFilter;

            const matchesModule =
                moduleFilter === 'all' ? true : item.moduleName === moduleFilter;

            return matchesStatus && matchesModule;
        });
    }, [results, statusFilter, moduleFilter]);

    const renderSummaryButton = (
        filter: StatusFilter,
        label: string,
        count: number,
        extraClass = ''
    ) => (
        <button
            type="button"
            className={`summary-chip  ${extraClass} ${statusFilter === filter ? 'active' : ''}`.trim()}
            onClick={() => setStatusFilter(filter)}
        >
            <span className="summary-chip-label">{label}</span>
            <span className="summary-chip-count">{count}</span>
        </button>
    );

    return (
        <section className="results-section">
            <div className="results-header">
                <h2>Детализированные результаты</h2>
            </div>

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

                    <div className="results-filters">
                        <label className="module-filter">
                            <span>Модуль:</span>
                            <select
                                value={moduleFilter}
                                onChange={(e) => setModuleFilter(e.target.value)}
                            >
                                <option value="all">Все модули</option>
                                {modules.map((moduleName) => (
                                    <option key={moduleName} value={moduleName}>
                                        {moduleName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="result-table-wrapper">
                        <table className="result-table">
                            <colgroup>
                                <col style={{ width: '22%' }} />
                                <col style={{ width: '28%' }} />
                                <col style={{ width: '36%' }} />
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
                                Нет результатов для выбранных фильтров.
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};