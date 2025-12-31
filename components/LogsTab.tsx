import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface LogsTabProps {
    logs: LogEntry[];
}

function LogsTab({ logs }: LogsTabProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(function() {
        if (!chartRef.current) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const hourlyCounts = Array(24).fill(0);
        logs.forEach(function(log) {
            const hour = new Date(log.timestamp).getHours();
            hourlyCounts[hour]++;
        });

        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
            chartInstanceRef.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Array.from({ length: 24 }, function(_, i) { return (i.toString().padStart(2, '0') + ":00"); }),
                    datasets: [{
                        label: 'AI Tool Usage (by hour)',
                        data: hourlyCounts,
                        backgroundColor: 'rgba(79, 70, 229, 0.7)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        borderWidth: 1,
                        borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { 
                        y: { 
                            beginAtZero: true, 
                            title: { display: true, text: 'Number of Uses' },
                            ticks: {
                                stepSize: 1
                            }
                        } 
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        return function() {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [logs]);

    return (
        <section id={"log"}>
            <h2 className={"text-2xl font-bold text-gray-800 mb-4"}>{"Summary & Logs (AI Usage)"}</h2>
            <p className={"text-gray-600 mb-6"}>{"This section summarizes all AI tool usage, including inputs, outputs, and the date/time of use."}</p>

            <div className={"mb-8 p-4 bg-gray-50 rounded-lg shadow border border-gray-200"}>
                <h3 className={"text-xl font-semibold mb-3 text-gray-800"}>{"Website Usage Pattern (Hourly)"}</h3>
                <div className={"relative h-64 sm:h-80"}>
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>

            <h3 className={"text-xl font-semibold mb-4 text-gray-800"}>{"Recent Activity Log"}</h3>
            <div className={"space-y-3"}>
                {logs.length !== 0 ? (
                    logs.map(function(log, index) {
                        const isError = (log.output.indexOf('Error') === 0);
                        const statusColor = isError ? 'text-red-600' : 'text-green-600';
                        return (
                            <div key={index} className={"p-3 bg-gray-50 rounded-lg border border-gray-200"}>
                                <div className={"flex justify-between items-center"}>
                                    <p className={"font-bold text-sm text-indigo-600"}>{log.tool}</p>
                                    <p className={"text-xs text-gray-500"}>{new Date(log.timestamp).toLocaleString()}</p>
                                </div>
                                <p className={"text-xs text-gray-700 truncate mt-1"}>{"Input: "}{JSON.stringify(log.input)}</p>
                                <p className={"text-xs mt-1 font-medium " + statusColor}>
                                    {"Status: "}{log.output}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className={"text-gray-500 text-center py-4"}>{"No activity logs found for this session."}</p>
                )}
            </div>
        </section>
    );
}

export default LogsTab;