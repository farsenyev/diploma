import type {AnalysisReport} from '../../types';
import './ResultDashboard.css';
import {DonutChart} from "../charts/DonutChart.tsx";
import {ModuleBerChart} from "../charts/ModuleBerChart.tsx";

interface ResultDashboardProps {
    report: AnalysisReport;
}

const COLORS = {
    ok: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
};

const PRIORITY_LABELS = {
    low: 'Низкий приоритет',
    medium: 'Средний приоритет',
    high: 'Высокий приоритет',
};

const buildSummaryText = (report: AnalysisReport): string => {
    const {errors, warnings, ok, total} = report.summary;

    if (errors === 0 && warnings === 0) {
        return `Проверка страницы завершена успешно: все ${total} проверок выполнены без замечаний.`;
    }

    if (errors > 0 && warnings > 0) {
        return `Проверка страницы выявила ${errors} критических ${
            errors === 1 ? 'ошибку' : errors < 5 ? 'ошибки' : 'ошибок'
        } и ${warnings} предупреждений. Основное внимание рекомендуется уделить модулям, содержащим ошибки и предупреждения.`;
    }

    if (errors > 0) {
        return `Проверка страницы выявила ${errors} критических ${
            errors === 1 ? 'ошибку' : errors < 5 ? 'ошибки' : 'ошибок'
        }. Необходимо устранить обнаруженные нарушения перед дальнейшей оценкой интерфейса.`;
    }

    return `Проверка страницы завершена с предупреждениями: найдено ${warnings} замечаний при ${ok} успешных проверках.`;
};

// const STATUS_LABELS: Record<'ok' | 'warning' | 'error', string> = {
//     ok: 'OK',
//     warning: 'WARNING',
//     error: 'ERROR',
// };

// const StatusTooltip = ({ active, payload}: { active?: boolean; payload?: Array<{ name: string; value: number }>}) => {
//     if (!active || !payload || payload.length === 0) {
//         return null;
//     }
//
//     return (
//         <div className="custom-tooltip">
//             {payload.map((entry) => (
//                 <div key={entry.name} className="tooltip-row">
//                     <span className={`tooltip-dot tooltip-${entry.name.toLowerCase()}`} />
//                     <span className="tooltip-name">{entry.name}:</span>
//                     <span className="tooltip-value">{entry.value}</span>
//                 </div>
//             ))}
//         </div>
//     );
// };

// const ModuleTooltip = ({active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string }>; label?: string; }) => {
//     if (!active || !payload || payload.length === 0) {
//         return null;
//     }
//
//     return (
//         <div className="custom-tooltip">
//             <div className="tooltip-title">{label}</div>
//             {payload.map((entry) => (
//                 <div key={entry.dataKey} className="tooltip-row">
//           <span
//               className="tooltip-dot"
//               style={{ backgroundColor: entry.color }}
//           />
//                     <span className="tooltip-name">
//             {STATUS_LABELS[entry.dataKey as 'ok' | 'warning' | 'error']}:
//           </span>
//                     <span className="tooltip-value">{entry.value}</span>
//                 </div>
//             ))}
//         </div>
//     );
// };

export const ResultDashboard = ({report}: ResultDashboardProps) => {
    // const pieData = [
    //     {
    //         name: 'OK',
    //         value: report.summary.ok,
    //         color: COLORS.ok,
    //     },
    //     {
    //         name: 'WARNING',
    //         value: report.summary.warnings,
    //         color: COLORS.warning,
    //     },
    //     {
    //         name: 'ERROR',
    //         value: report.summary.errors,
    //         color: COLORS.error,
    //     },
    // ].filter((item) => item.value > 0);

    // const moduleData = report.modules.map((module) => ({
    //     name: module.moduleName,
    //     ok: module.ok,
    //     warning: module.warnings,
    //     error: module.errors,
    //     total: module.total,
    // }));

    const summaryText = buildSummaryText(report);

    return (
        <section className="dashboard">
            <div className="dashboard-summary-text">
                <h2>Сводка анализа</h2>
                <p>{summaryText}</p>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <div className="dashboard-card-label">Score</div>
                    <div className="dashboard-card-value">{report.score}</div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-label">Grade</div>
                    <div className="dashboard-card-value">{report.grade}</div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-label">Всего проверок</div>
                    <div className="dashboard-card-value">{report.summary.total}</div>
                </div>

                <div className="dashboard-card error">
                    <div className="dashboard-card-label">Ошибки</div>
                    <div className="dashboard-card-value">{report.summary.errors}</div>
                </div>

                <div className="dashboard-card warning">
                    <div className="dashboard-card-label">Предупреждения</div>
                    <div className="dashboard-card-value">{report.summary.warnings}</div>
                </div>

                <div className="dashboard-card ok">
                    <div className="dashboard-card-label">OK</div>
                    <div className="dashboard-card-value">{report.summary.ok}</div>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-wrapper">
                    <div className="chart-card">
                        <h3>Распределение результатов</h3>
                        {/*<div className="chart-with-legend">*/}
                        {/*<div className="donut-chart-wrapper">*/}
                        <DonutChart report={report} colors={COLORS}/>
                        {/*</div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="chart-card">
                        <h3>Результаты по модулям</h3>
                        {/*<Chart for modules>*/}
                        <ModuleBerChart report={report} colors={COLORS}/>
                    </div>
                </div>


                {report.recommendations?.length > 0 && (
                    <div className="recommendations-card">
                        <div className="recommendations-header">
                            <h3>Ключевые рекомендации</h3>
                            <p>
                                Ниже приведены основные рекомендации по улучшению доступности и
                                структуры интерфейса.
                            </p>
                        </div>

                        <div className="recommendations-grid">
                            {report.recommendations.map((item, index) => (
                                <div
                                    key={`${item.moduleName}-${index}`}
                                    className={`recommendation-item priority-${item.priority}`}
                                >
                                    <div className="recommendation-top">
                                        <div className="recommendation-module">
                                            {item.moduleName}
                                        </div>
                                        <div className={`recommendation-priority badge-${item.priority}`}>
                                            {PRIORITY_LABELS[item.priority]}
                                        </div>
                                    </div>

                                    <p className="recommendation-text">{item.recommendation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};