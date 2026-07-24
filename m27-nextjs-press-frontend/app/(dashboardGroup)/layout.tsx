import { Navbar } from '@/components/shared/navbar';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import { getMe } from '@/service/getMe';
import React from 'react';
import DashboardSidebar from './_components/dashboardSidebar';

const DashboardLayout = async ({children} : {children : React.ReactNode}) => {

     const user = await getMe();
    
    return (
        <div>
            <Navbar user={user}></Navbar>
            <SidebarProvider className='flex-1'>
                <DashboardSidebar user={user}/>
                <main className='flex-1 min-w-0'> {children}</main>
            </SidebarProvider>
            
        </div>
    );
};

export default DashboardLayout;