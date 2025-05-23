export interface ApexChartConfig {
    annotations?: ApexAnnotations;
    chart?: ApexChart;
    colors?: string[];
    dataLabels?: ApexDataLabels;
    fill?: ApexFill;
    forecastDataPoints?: ApexForecastDataPoints;
    grid?: ApexGrid;
    labels?: string[];
    legend?: ApexLegend;
    markers?: ApexMarkers;
    noData?: ApexNoData;
    plotOptions?: ApexPlotOptions;
    responsive?: ApexResponsive[];
    series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
    states?: ApexStates;
    stroke?: ApexStroke;
    subtitle?: ApexTitleSubtitle;
    theme?: ApexTheme;
    title?: ApexTitleSubtitle;
    tooltip?: ApexTooltip;
    xaxis?: ApexXAxis | ApexXAxis[];
    yaxis?: ApexYAxis | ApexYAxis[];
    _chartInstances?: any[];
}

interface ApexGlobals {
    chartID?: string;
    cuid?: string;
    events?: { [key: string]: Function };
    colors?: string[];
    clientX?: number;
    clientY?: number;
    [key: string]: any;
}

export interface ApexTypeConfig {
    config?: ApexChartConfig;
    globals?: ApexGlobals;
    seriesIndex?: number;
    dataPointIndex?: number;
}

export interface ApexTooltip {
    dataPointIndex: number;
    series: number[][]
    w: {
        config: {};
        globals: {
            LINE_HEIGHT_RATIO: number;
            SVGNS: string;
            allSeriesCollapsed: boolean;
            allSeriesHasEqualX: boolean;
            ancillaryCollapsedSeries: any[];
            ancillaryCollapsedSeriesIndices: any[];
            animationEnded: boolean;
            areaGroups: any[];
            axisCharts: boolean;
            barGroups: string[];
            barHeight: number | undefined;
            barPadForNumericAxis: number;
            barWidth: number;
            capturedDataPointIndex: number;
            capturedSeriesIndex: number;
            categoryLabels: string[];
            chartClass: string;
            chartID: string;
            clientX: number;
            clientY: number;
            collapsedSeries: any[];
            collapsedSeriesIndices: any[];
            colors: string[];
            columnSeries: {
                series: any[];
                i: any[];
            };
            comboBarCount: number;
            comboCharts: boolean;
            cuid: string;
            dataChanged: boolean;
            dataFormatXNumeric: boolean;
            dataLabels: {
                style: Record<string, any>;
            };
            dataLabelsRects: any[][];
            dataPoints: number;
            defaultLabels: boolean;
            delayedElements: Record<string, any>[];
            dom: Record<string, any>;
            easing: (t: number) => void;
            events: Record<string, any>;
            fill: {
                colors: string[];
            };
            goldenPadding: number;
            gridHeight: number;
            gridWidth: number;
            groups: any[];
            hasNullValues: boolean;
            hasSeriesGroups: boolean;
            hasXaxisGroups: boolean;
            ignoreYAxisIndexes: any[];
            initialConfig: Record<string, any>;
            initialMaxX: number;
            initialMinX: number;
            initialSeries: any[];
            invalidLogScale: boolean;
            isBarHorizontal: boolean;
            isDataXYZ: boolean;
            isDirty: boolean;
            isExecCalled: boolean;
            isMultiLineX: boolean;
            isMultipleYAxis: boolean;
            isRangeBar: boolean;
            isSlopeChart: boolean;
            isTouchDevice: boolean | undefined;
            isXNumeric: boolean;
            labels: string[];
            lastClientPosition: Record<string, any>;
            lastDrawnDataLabelsIndexes: any[][];
            lastXAxis: Record<string, any>;
            lastYAxis: Record<string, any>[];
            legendFormatter: (e: any) => any;
            lineGroups: any[];
            locale: Record<string, any>;
            logYRange: (number | undefined)[];
            markers: {
                colors: string[];
                size: number[];
                largestSize: number;
            };
            maxDate: number;
            maxValsInArrayIndex: number;
            maxX: number;
            maxY: number;
            maxYArr: number[];
            maxZ: number;
            memory: {
                methodsToExec: any[];
            };
            minDate: number;
            minX: number;
            minXDiff: number;
            minY: number;
            minYArr: number[];
            minZ: number;
            mousedown: boolean;
            multiAxisTickAmount: number;
            niceScaleAllowedMagMsd: number[][];
            niceScaleDefaultTicks: number[];
            noData: boolean;
            noLabelsProvided: boolean;
            padHorizontal: number;
            panEnabled: boolean;
            pointsArray: any[];
            previousPaths: Record<string, any>[];
            radarPolygons: Record<string, any>;
            radialSize: number;
            resizeTimer: number | null;
            resized: boolean;
            risingSeries: any[];
            rotateXLabels: boolean;
            scaleX: number;
            scaleY: number;
            selectedDataPoints: any[];
            selection: any;
            selectionEnabled: boolean;
            selectionResizeTimer: number | null;
            series: any[][];
            seriesCandleC: any[];
            seriesCandleH: any[];
            seriesCandleL: any[];
            seriesCandleM: any[];
            seriesCandleO: any[];
            seriesColors: (string | undefined)[];
            seriesGoals: any[];
            seriesGroups: any[][];
            seriesLog: any[][];
            seriesNames: string[];
            seriesPercent: any[][];
            seriesRange: any[];
            seriesRangeEnd: any[];
            seriesRangeStart: any[];
            seriesTotals: number[];
            seriesX: any[];
            seriesXvalues: any[][];
            seriesYAxisMap: any[][];
            seriesYAxisReverseMap: number[];
            seriesYvalues: any[][];
            seriesZ: any[][];
            shouldAnimate: boolean;
            skipFirstTimelinelabel: boolean;
            skipLastTimelinelabel: boolean;
            stackedSeriesTotals: number[];
            stackedSeriesTotalsByGroups: any[][];
            stroke: {
                colors: string[];
            };
            svgHeight: number;
            svgWidth: number;
            timescaleLabels: any[];
            tooltip: any;
            total: number;
            translateX: number;
            translateXAxisX: number;
            translateXAxisY: number;
            translateY: number;
            translateYAxisX: number[];
            ttKeyFormatter: (t: any) => any;
            ttVal: any;
            ttZFormatter: (t: any) => any;
            visibleXRange: any;
            xAxisGroupLabelsHeight: number;
            xAxisHeight: number;
            xAxisLabelsHeight: number;
            xAxisLabelsWidth: number;
            xAxisScale: any;
            xAxisTicksPositions: any[];
            xLabelFormatter: (t: any) => any;
            xRange: number;
            xTickAmount: number;
            xaxisTooltipFormatter: (e: any) => any;
            xyCharts: boolean;
            yAxisLabelsWidth: number;
            yAxisScale: Record<string, any>[];
            yAxisWidths: any[];
            yLabelFormatters: ((t: any) => any)[];
            yLabelsCoords: Record<string, any>[];
            yLogRatio: number[];
            yRange: number[];
            yTitleCoords: Record<string, any>[];
            yValueDecimal: number;
            yaxis: any;
            zRange: number;
            zoomEnabled: boolean;
            zoomed: boolean;
        };
    };
}
