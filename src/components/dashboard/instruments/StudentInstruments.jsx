import React from 'react';
import ShopifyStore from './ShopifyStore';
import './Instruments.css';

const StudentInstruments = () => {
    return (
        <div className='instruments-container'>
            <div className='instruments-split-top'>
                <div className='header1 instruments-header'>Instruments</div>
            </div>
            <ShopifyStore />
        </div>
    );
};

export default StudentInstruments;