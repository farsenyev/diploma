import type {AnalysisReport} from "../../types";
import {ReactECharts} from "./ReactEChart.tsx";

type StatusColors = {
    ok: string;
    warning: string;
    error: string;
};


type DonutChartProps = {
    report: AnalysisReport;
    colors:  StatusColors;
}

export function DonutChart({ report, colors }: DonutChartProps) {
    const data = {
        title: {
            text: report.grade,
            // subtext: 'grade',
            top: 'center',
            left: 'center',
            textStyle: {
                color: '#cbd5e1',
                fontSize: 30
            },
            // subtextStyle: {
            //     color: '#cbd5e1',
            //     fontSize: 20,
            //     top: '-1px'
            // }
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['Errors', 'Warnings', 'OK'],
            textStyle: {
                color: '#cbd5e1',
            }
        },
        series: [{
            type: 'pie',
            data: [
                {
                    value: report.summary.errors,
                    name: 'Errors',
                    itemStyle: {
                        color: colors.error,
                    },
                    label: {
                        color: '#cbd5e1',
                    }
                },
                {
                    value: report.summary.warnings,
                    name: 'Warnings',
                    itemStyle: {
                        color: colors.warning,
                    },
                    label: {
                        color: '#cbd5e1',
                    }
                },
                {
                    value: report.summary.ok,
                    name: 'OK',
                    itemStyle: {
                        color: colors.ok,
                    },
                    label: {
                        color: '#cbd5e1',
                    }
                },
            ],
            radius: ['40%', '70%']
        }]
    }

    const donutStyle = {
        width: '100%',
        height: '90%',
    }

    return (
        <>
            <ReactECharts option={data} style={donutStyle}/>
        </>
    )
}