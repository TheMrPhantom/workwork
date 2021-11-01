import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,Legend } from 'recharts';


const BadMemberLineChart = ({ memberData }) => {
    

    const data = []
    memberData.forEach(element => {
        data.push({ ...element, "pv": 0, })
    });


    return (
        <ResponsiveContainer width="90%" height="90%">
            <AreaChart
                width={500}
                height={400}
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
                <Area type="monotone" dataKey="Mitglieder" stroke="var(--primaryColor)" fill="var(--secondaryColor)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default BadMemberLineChart
