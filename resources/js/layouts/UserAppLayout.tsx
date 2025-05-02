import UserSidebarLayout from '@/layouts/User/User-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface UserAppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: UserAppLayoutProps) => (
    <UserSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </UserSidebarLayout>
);
