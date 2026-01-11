import { NextAuthMiddlewareOptions, NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const accessiblePaths: any = {
    admin: [
        '/dashboard/admin', 
        '/dashboard/admin/users'
    ],
    user: [
        '/dashboard/user', 
        '/dashboard/user/profile', 
        '/dashboard/user/orders', 
        '/dashboard/user/orders/submit'
    ],
    supplier: [
        '/dashboard/supplier', 
        '/dashboard/supplier/profile', 
        '/dashboard/supplier/orders',
        '/dashboard/supplier/trends',
    ],
};

const roleRedirection: Record<string, string> = {
    user: "/dashboard/user",
    supplier: "/dashboard/supplier",
    admin: "/dashboard/admin",
};

function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const typedToken = req.nextauth.token as any;
    const userRole = typedToken?.role.type;

    const redirectTo = (path: string) => NextResponse.redirect(new URL(path, req.url));

    // Get the specific dashboard and accessible paths for the user's role
    const specificDashboardPath = roleRedirection[userRole] || '/unauthorized';
    const userAccessiblePaths = accessiblePaths[userRole] || [];

    // Redirect to the specific dashboard if they're accessing the general dashboard
    if (pathname === '/dashboard' && specificDashboardPath) {
        return redirectTo(specificDashboardPath);
    }

    // Check if the user is trying to access a path outside their role's accessible paths
    if (!userAccessiblePaths.includes(pathname)) {
        // Redirect to their dashboard or an unauthorized page
        return redirectTo(specificDashboardPath);
    }

    // Proceed as normal if the path is allowed
    return NextResponse.next();
}

const options: NextAuthMiddlewareOptions = {
    pages: {
        signIn: "/login",
    },
    callbacks: { authorized: ({ token }) => !!token }
};

export default withAuth(middleware, options);

export const config = {
    matcher: [
        '/dashboard/:path*',
    ]
};
