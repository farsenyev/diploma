import type {AnalysisReport} from "../../types";
import {ReactECharts} from "./ReactEChart.tsx";

type StatusColors = {
    ok: string;
    warning: string;
    error: string;
};

type ModuleBarChartProps = {
    report: AnalysisReport;
    colors:  StatusColors;
}
export function ModuleBerChart({report, colors}: ModuleBarChartProps) {


    const data = report.modules.map((module) => (
        {
            name: module.moduleName,
            ok: module.ok,
            warning: module.warnings,
            error: module.errors,
            total: module.total,
        }
    ));


    const dataOK = data.map(e => e.ok)
    const dataERROR = data.map(e => e.error)
    const dataWarning = data.map(e => e.warning)


    const dataBar = {
        xAxis: {
            axisLabel: {
                color: '#cbd5e1'
            }
        },
        yAxis: {
            data: data.map(e => e.name),
            axisLabel: {
                color: '#cbd5e1'
            }
        },
        tooltip: {},
        series: [
            {
                name: 'OK',
                type: 'bar',
                data: dataOK,
                stack: 'x',
                itemStyle: {
                    color: colors.ok,
                }
            },
            {
                name: 'Error',
                type: 'bar',
                data: dataERROR,
                stack: 'x',
                itemStyle: {
                    color: colors.error,
                }
            },
            {
                name: 'Warning',
                type: 'bar',
                data: dataWarning,
                stack: 'x',
                itemStyle: {
                    color: colors.warning,
                }
            }
        ],
        backgroundColor: "transparent",
        animationDuration: 600,
        animationEasing: "cubicOut",

        grid: {
            top: 48,
            right: 20,
            bottom: 24,
            left: 180,
            containLabel: false,
        },

    }

    console.log(data)

    const barStyle = {
        width: '100%',
        height: '90%',
    }


    return (
        <>
            <ReactECharts option={dataBar} style={barStyle} />
        </>
    )
}