import { Navbar } from '@/components/shared/navbar';
import { getMe } from '@/service/getMe';
import React from 'react';

const PublicRootLayout =  async ({children} : {children : React.ReactNode}) => {

    const user = await getMe();
    
    return (
        <div className=''>
            <Navbar user={user}></Navbar>
            {children}
        </div>
    );
};

export default PublicRootLayout;