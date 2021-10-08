import React from 'react'
import OverviewBox from './OverviewBox';
import Request from './Request';

const Overview = () => {
    return (
        <div>
            <OverviewBox />
            <Request headline="Ausstehende Anfragen" />
            <Request headline="Genehmigte Anfragen" />
        </div>
    )
}

export default Overview
