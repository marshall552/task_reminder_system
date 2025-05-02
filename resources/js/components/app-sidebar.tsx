// import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
// import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link } from '@inertiajs/react';
// import { Folder, LayoutGrid, Calendar, Bell, UserRound} from 'lucide-react';
// import AppLogo from './app-logo';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutGrid,
//     },
    
//     {
//         title: 'Tasks',
//         href: '/assignee',
//         icon: Folder,
//     },

 
//     {
//         title: 'Members',
//         href: '/members',
//         icon: UserRound,
//     },

//     {
//         title: 'Notifications',
//         href: '/notifications',
//         icon: Bell,
//     },


// ];



// export function AppSidebar() {
//     return (
//         <Sidebar collapsible="icon" variant="sidebar">
//             <SidebarHeader>
//                 <SidebarMenu>
//                     <SidebarMenuItem>
//                         <SidebarMenuButton size="lg" asChild>
//                             <Link href="/dashboard" prefetch>
//                                 <AppLogo />
//                             </Link>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 </SidebarMenu>
//             </SidebarHeader>

//             <SidebarContent>
//                 <NavMain items={mainNavItems} />
//             </SidebarContent>

//             <SidebarFooter>
//                 <NavUser />
//             </SidebarFooter>
//         </Sidebar>
//     );
// }


/////////////////////////////


// import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
// import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link, usePage } from '@inertiajs/react';
// import { Folder, LayoutGrid, Calendar, Bell, UserRound } from 'lucide-react';
// import AppLogo from './app-logo';

// interface CustomPageProps {
//   isAdmin?: boolean;
//     [key: string]: any; // Allow other properties
// }
    
// const mainNavItems: NavItem[] = [
//   {
//     title: 'Dashboard',
//     href: '/dashboard',
//     icon: LayoutGrid,
//   },
//   {
//     title: 'Tasks',
//     href: '/assignee',
//     icon: Folder,
//   },
//   {
//     title: 'Members',
//     href: '/members',
//     icon: UserRound,
//   },
//   {
//     title: 'Notifications',
//     href: '/notifications',
//     icon: Bell,
//   },
// ];

// export function AppSidebar() {
//   const { isAdmin } = usePage<CustomPageProps>().props;
//   console.log('isAdmin:', isAdmin); // Debug log

//   // Filter nav items based on user role
//   const filteredNavItems = mainNavItems.filter((item) => {
//     if (item.title === 'Members') {
//       return isAdmin === true; // Only include Members if user is admin
//     }
//     return true;
//   });

//   return (
//     <Sidebar collapsible="icon" variant="sidebar">
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton size="lg" asChild>
//               <Link href="/dashboard" prefetch>
//                 <AppLogo />
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>

//       <SidebarContent>
//         <NavMain items={filteredNavItems} />
//       </SidebarContent>

//       <SidebarFooter>
//         <NavUser />
//       </SidebarFooter>
//     </Sidebar>
//   );
// }



//////////////////////////////////////





import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Folder, LayoutGrid, Calendar, Bell, UserRound } from 'lucide-react';
import AppLogo from './app-logo';

interface CustomPageProps {
  isAdmin?: boolean;
  [key: string]: any; // Allow other properties
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Tasks',
    href: '/assignee',
    icon: Folder,
  },
  {
    title: 'Members',
    href: '/members',
    icon: UserRound,
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
];

export function AppSidebar() {
  const { isAdmin } = usePage<CustomPageProps>().props;
  console.log('AppSidebar - isAdmin:', isAdmin); // Debug log

  // Filter nav items based on user role
  const filteredNavItems = mainNavItems.filter((item) => {
    if (item.title === 'Members') {
      return isAdmin === true; // Only include Members if user is admin
    }
    return true;
  });
  console.log('AppSidebar - filteredNavItems:', filteredNavItems); // Debug log

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}