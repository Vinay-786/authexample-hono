import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { Toaster } from 'sonner';

interface MyRouterContext {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Root,
});


function NavBar() {
    return (
        <>
            <div className="p-2 flex gap-2">
                <Link to="/" className="[&.active]:font-bold">
                    Home
                </Link>{' '}
                <Link to="/about" className="[&.active]:font-bold">
                    About
                </Link>
                <Link to='/profile' className='[&.active]:font-bold'>
                    profile
                </Link>
                <Link to='/main' className='[&.active]:font-bold'>
                    dashboard
                </Link>
            </div>
            <hr />
        </>
    )
};

function Root() {
    return (
        <>
            <NavBar />
            <hr />
            <Toaster richColors />
            <div className='p-2 gap-2 max-w-2xl m-auto'>
                <Outlet />
            </div>
        </>
    );
}

