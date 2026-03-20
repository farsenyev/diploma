import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { CSSProperties } from 'react';

import { forceResizeCharts } from './UtilsForCharts';

interface IOnEvents {
    type: string;
    func: Function;
}

export interface ReactEChartsProps {
    option: any;
    onEvents?: IOnEvents;
    style?: CSSProperties;
    settings?: echarts.SetOptionOpts;
    loading?: boolean;
    theme?: 'light' | 'dark';
    forceResize?: boolean;
}


export interface ILegendselectchangedParams {
    name: string;
    selected: Record<string, boolean>;
    type: string;
}


export function ReactECharts({
                                 option,
                                 onEvents,
                                 style,
                                 settings,
                                 loading,
                                 theme,
                                 forceResize = true,
                             }: ReactEChartsProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let chart: echarts.ECharts | undefined;

        if (chartRef.current !== null) {
            chart = echarts.init(chartRef.current, theme);
        }

        function resizeChart() {
            chart?.resize();
        }

        window.addEventListener('resize', resizeChart);

        let observer: MutationObserver | undefined

        if (forceResize) observer = forceResizeCharts(resizeChart);

        return () => {
            observer?.disconnect()
            chart?.dispose();
            window.removeEventListener('resize', resizeChart);
        };
    }, [theme, forceResize]);

    useEffect(() => {
        if (chartRef.current !== null) {
            const chart = echarts.getInstanceByDom(chartRef.current);
            chart?.setOption(option, settings);
            chart?.on(onEvents?.type!, function (params: any) {
                onEvents?.func(params);
                chart?.setOption(option, settings);
            });
        }
    }, [option, settings, onEvents, theme]);

    useEffect(() => {
        if (chartRef.current !== null) {
            const chart = echarts.getInstanceByDom(chartRef.current);

            loading === true ? chart?.showLoading() : chart?.hideLoading();
        }
    }, [loading, theme]);

    return (
        <div className="chart" ref={chartRef} style={{ width: '100%', height: '100%', ...style }} />
    );
}