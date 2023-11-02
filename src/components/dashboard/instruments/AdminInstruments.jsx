import React from 'react';
import ShopifyStore from './ShopifyStore';
import './Instruments.css';

/*

Component: AdminInstruments

Top level component for admin instruments. Links to shopify login to manage store and instantiates the
ShopifyStore for preview. 

Props: 

Parents: AdminDashboard
Children: ShopifyStore

*/

const AdminInstruments = () => {
    return (
        <div className='instruments-container'>
            <div className='instruments-split-top'>
                <div className='header1 instruments-header'>Instruments</div>
                <a href="https://accounts.shopify.com/lookup?rid=a13edc00-e476-491c-9d08-38670e4e6a74" target="_blank" rel="noreferrer" >
                    <button className='button-29'>
                        <div className='shopify-button-text'>Manage on Shopify</div>
                    </button>
                </a>
            </div>
            <ShopifyStore />
        </div>
    );
};

export default AdminInstruments;