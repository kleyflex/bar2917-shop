'use client'
import MainLayout from "@/components/layouts/MainLayout";
import Loader from "@/components/ui/Loader";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { StatisticsService } from "../services/statistics.service";

const Dashboard: FC = () => {
    const { data, isFetching } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => StatisticsService.getMain(),
        select: (data) => data.data
    })

    return (
        <MainLayout>
            <section>
                <h1>Статистика</h1>
                {isFetching ? (
                    <Loader />
                    ) : data?.length ? (
                    <div className="w-10/12 flex-row justify-between">
                        {data.map((item, index) => (
                        <div key={item.name} className=" h-24 w-56 justify-between bg-background-card rounded-lg p-4 border border-card-border">
                            <div>{item.name}</div>
                            <div>
                            <p className="text-white font-normal text-2xl">{item.value}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <div>Statistics not loaded!</div>
                    )}
            </section>
        </MainLayout>
    )
}

export default Dashboard