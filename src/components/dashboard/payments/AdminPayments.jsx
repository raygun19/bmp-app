import React from 'react';
import './Payments.css';

/*

Component: AdminPayments

Displays link to quickbooks for admin payment management.

Props: 

Parents: AdminDashboard
Children:

*/

const AdminPayments = () => {
    return (
        <div className='payments-container'>
            <div className='header1 payments-header'>Payments</div>
            <div className='payment-content'>
                <div className='payments-qb-container'>
                    <div className='header2'>Quickbooks</div>
                    <div className='qb-container'>
                        <a href="https://accounts.intuit.com/app/sign-in" target="_blank" rel="noreferrer" >
                            <div className='button-28'>
                                <div className='payments-button-text'>Sign in to quickbooks</div></div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;
