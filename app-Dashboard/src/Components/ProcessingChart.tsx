import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { FetchingData } from "../Fetchdata/FetchingData";
import { Legend } from "recharts";
export default function ProcessingChart() {
    const [Stats, setStats] = useState<(any)>(null)
    function CounterAnimation({ numberDoc }: { numberDoc: number }) {
        const [counter, setCounter] = useState<(number)>(0)
        useEffect(() => {
            let start = 0
            const numberEnd = numberDoc;
            const duration = 1200;
            const animationstep = Math.ceil(numberEnd / (duration / 15))
            const animationInterval = setInterval(() => {
                start += animationstep;
                if (start >= numberEnd) {
                    start = numberEnd;
                    clearInterval(animationInterval)
                }
                setCounter(start)
            }, 15)
            return () => clearInterval(animationInterval)
        }, [numberDoc]);
        return (
            <div className="p-6 bg-white shadow rounded-xl text-center">
                <h2 className="text-3xl font-bold">{counter.toLocaleString()}</h2>
                <p className="text-gray-500">Total Documents</p>
            </div>

        );



    }
    useEffect(() => {

        FetchingData().then(setStats)
    }, [])
    if (!Stats) {
        return <div>Loading....</div>


    }
    const DocumentSector = [
        {
            name: "Healthcare", value: Stats.by_sector.healthcare
        },
        {
            name: "Legal", value: Stats.by_sector.legal
        },
        {
            name: "Finance", value: Stats.by_sector.finance
        },
        {
            name: "Other", value: Stats.by_sector.other
        }

    ]

    const DocStatus = [

        { name: "Completed", value: Stats.by_status.completed },
        { name: "In_progress", value: Stats.by_status.in_progress },
        { name: "Failed", value: Stats.by_status.failed }
    ]
    const sectorColor = ["#4CAF50", "#2196F3", "#FFC107", "#9E9E9E"];
    const Status_Color = ["#4CAF50", "#FFC107", "#F44336"]


    return (
        <div className="grid grid-cols-1 md:grid-rows-1 gap-6  ">
            <div>
                 <h3 className="font-bold mb-4">Documents Chart Process</h3>
            </div>
           
            <div className="flex flex-col gap-6">
                <div>
                    <CounterAnimation numberDoc={Stats.total_documents} />
                </div>
                <div className="w-auto flex flex-row gap-6">




                    <div className="w-full p-6 bg-white shadow rounded-xl">
                        <h3 className="font-semibold mb-4">Documents by Sector</h3>
                        <ResponsiveContainer width="100%" height={270}>
                            <PieChart>
                                <Pie data={DocumentSector} dataKey="value" nameKey="name" outerRadius={90} label>
                                    {DocumentSector.map((_, i) => (
                                        <Cell key={i} fill={sectorColor[i]} />
                                    ))}
                                </Pie>
                                 <Legend verticalAlign="bottom" height={30} />
                            </PieChart>
                           
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full p-6 bg-white shadow rounded-xl">
                        <h3 className="font-semibold mb-4">Processing Status</h3>
                        <ResponsiveContainer width="100%" height={270}>
                            <PieChart>
                                <Pie data={DocStatus} dataKey="value" innerRadius={50} outerRadius={90} label >
                                    {DocStatus.map((_, i) => (
                                        <Cell key={i} fill={Status_Color[i]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={30} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>


                </div>

            </div>


            <div className="flex flex-col gap-6">



                <div className="p-6 bg-white shadow rounded-xl">
                    <h3 className="font-semibold mb-4">Average Processing Time(For the last 7 days)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={Stats.processing_time_trend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, "dataMax + 1"]} />
                            <Tooltip />

                            <Line type="monotone" dataKey="avg_time_seconds" stroke="#2196F3" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>


        </div>








    )







}