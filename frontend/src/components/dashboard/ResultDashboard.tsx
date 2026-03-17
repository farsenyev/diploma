import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import type { AnalysisReport } from '../../types';
import './ResultDashboard.css';

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
    const { errors, warnings, ok, total } = report.summary;

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

const STATUS_LABELS: Record<'ok' | 'warning' | 'error', string> = {
    ok: 'OK',
    warning: 'WARNING',
    error: 'ERROR',
};

const StatusTooltip = ({
                           active,
                           payload,
                       }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
}) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (
        <div className="custom-tooltip">
            {payload.map((entry) => (
                <div key={entry.name} className="tooltip-row">
                    <span className={`tooltip-dot tooltip-${entry.name.toLowerCase()}`} />
                    <span className="tooltip-name">{entry.name}:</span>
                    <span className="tooltip-value">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

const ModuleTooltip = ({
                           active,
                           payload,
                           label,
                       }: {
    active?: boolean;
    payload?: Array<{ dataKey: string; value: number; color: string }>;
    label?: string;
}) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (
        <div className="custom-tooltip">
            <div className="tooltip-title">{label}</div>
            {payload.map((entry) => (
                <div key={entry.dataKey} className="tooltip-row">
          <span
              className="tooltip-dot"
              style={{ backgroundColor: entry.color }}
          />
                    <span className="tooltip-name">
            {STATUS_LABELS[entry.dataKey as 'ok' | 'warning' | 'error']}:
          </span>
                    <span className="tooltip-value">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export const ResultDashboard = ({ report }: ResultDashboardProps) => {
    const pieData = [
        {
            name: 'OK',
            value: report.summary.ok,
            color: COLORS.ok,
        },
        {
            name: 'WARNING',
            value: report.summary.warnings,
            color: COLORS.warning,
        },
        {
            name: 'ERROR',
            value: report.summary.errors,
            color: COLORS.error,
        },
    ].filter((item) => item.value > 0);

    const moduleData = report.modules.map((module) => ({
        name: module.moduleName,
        ok: module.ok,
        warning: module.warnings,
        error: module.errors,
        total: module.total,
    }));

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
                <div className="chart-card">
                    <h3>Распределение результатов</h3>

                    <div className="chart-with-legend">
                        <div className="donut-chart-wrapper">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={70}
                                        outerRadius={105}
                                        paddingAngle={3}
                                        stroke="none"
                                    >
                                        {pieData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<StatusTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="status-legend">
                            <div className="status-legend-item">
                                <span
                                    className="status-legend-dot"
                                    style={{ backgroundColor: COLORS.ok }}
                                />
                                <span className="status-legend-label">OK</span>
                                <span className="status-legend-value">{report.summary.ok}</span>
                            </div>

                            <div className="status-legend-item">
                                <span
                                    className="status-legend-dot"
                                    style={{ backgroundColor: COLORS.warning }}
                                />
                                <span className="status-legend-label">WARNING</span>
                                <span className="status-legend-value">
                  {report.summary.warnings}
                </span>
                            </div>

                            <div className="status-legend-item">
                                <span
                                    className="status-legend-dot"
                                    style={{ backgroundColor: COLORS.error }}
                                />
                                <span className="status-legend-label">ERROR</span>
                                <span className="status-legend-value">{report.summary.errors}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Результаты по модулям</h3>

                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                            data={moduleData}
                            layout="vertical"
                            margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={170}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip content={<ModuleTooltip />} />
                            <Legend />
                            <Bar dataKey="ok" stackId="a" fill={COLORS.ok} radius={[0, 0, 0, 0]} />
                            <Bar
                                dataKey="warning"
                                stackId="a"
                                fill={COLORS.warning}
                                radius={[0, 0, 0, 0]}
                            />
                            <Bar
                                dataKey="error"
                                stackId="a"
                                fill={COLORS.error}
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
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
        </section>
    );
};