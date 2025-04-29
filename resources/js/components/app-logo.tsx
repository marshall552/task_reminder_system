// import AppLogoIcon from './app-logo-icon';

// export default function AppLogo() {
//     return (
//         <>
//             <div className="bg-blue-950 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
//                 <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
//             </div>
//             <div className="ml-1 grid flex-1 text-left text-sm">
//                 <span className="mb-0.5 truncate leading-none font-semibold">TASKO</span>
//             </div>
//         </>
//     );
// }

import { FC } from 'react';

const AppLogo: FC = () => {
    return (
        <>
            <div className="bg-blue-950 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <img src="/images/task-logo.png" alt="Tasko Logo" className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">TASKO</span>
            </div>
        </>
    );
};

export default AppLogo;