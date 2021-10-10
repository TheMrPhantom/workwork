import React from 'react'
import OverviewBox from './OverviewBox';
import Request from './Request';

const Overview = () => {
    return (
        <div>
            <OverviewBox />
            <Request headline="Ausstehende Anfragen" requestName="requests/pending"/>
            <Request headline="Genehmigte Anfragen" requestName="requests/accepted" />
        </div>
    )
}

export default Overview
