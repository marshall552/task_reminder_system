
import UserAppLayout from '@/layouts/UserAppLayout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
    },
];

export default function UserDashboard() {
    return (
        <UserAppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">User Dashboard</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Welcome to your dashboard. Here you can view your tasks and notifications.
                </p>
                {/* Add dashboard content here, e.g., task overview, notifications */}
            </div>
        </UserAppLayout>
    );
}
