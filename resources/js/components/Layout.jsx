import { Link, router } from '@inertiajs/react';
import { Building, Heart, Home, LogIn, LogOut, Mail, Plus, Search, Settings, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../lib/firebase';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from './ui/sidebar';

const Layout = ({ children, title }) => {
    const { user, loading } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOutUser();
            toast.success('Successfully signed out!');
            router.visit('/', { replace: true });
        } catch (error) {
            toast.error('Failed to sign out. Please try again.');
        }
    };

    const navigationItems = [
        {
            title: 'Home',
            url: '/',
            icon: Home,
        },
        {
            title: 'Browse Properties',
            url: '/properties',
            icon: Search,
        },
        {
            title: 'My Bookmarks',
            url: '/bookmarks',
            icon: Heart,
            requireAuth: true,
        },
        {
            title: 'Create Listing',
            url: '/properties/create',
            icon: Plus,
            requireAuth: true,
        },
        {
            title: 'Contact Us',
            url: '/contact',
            icon: Mail,
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2 px-4 py-2">
                            <Building className="h-6 w-6 text-blue-600" />
                            <span className="text-lg font-bold">PropertyHub</span>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navigationItems.map((item) => {
                                        // Don't show auth-required items if user is not logged in
                                        if (item.requireAuth && !user) {
                                            return null;
                                        }

                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild>
                                                    <Link href={item.url} className="flex items-center gap-2">
                                                        <item.icon className="h-4 w-4" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {user && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Account</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href="/profile" className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span>Profile</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href="/settings" className="flex items-center gap-2">
                                                    <Settings className="h-4 w-4" />
                                                    <span>Settings</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}
                    </SidebarContent>

                    <SidebarFooter>
                        {user ? (
                            <div className="space-y-3 p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="truncate text-sm font-medium">{user.displayName || user.email}</p>
                                        <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                                    </div>
                                </div>
                                <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full justify-start">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <div className="p-4">
                                <Link href="/auth">
                                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </SidebarFooter>
                </Sidebar>

                <main className="flex flex-1 flex-col">
                    {/* Top Navigation Bar */}
                    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger />
                                {title && (
                                    <>
                                        <Separator orientation="vertical" className="h-6" />
                                        <h1 className="text-lg font-semibold">{title}</h1>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {user ? (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <span className="hidden text-sm font-medium sm:inline">{user.displayName || user.email}</span>
                                    </div>
                                ) : (
                                    <Link href="/auth">
                                        <Button size="sm">Sign In</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="flex-1 p-6">{children}</div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default Layout;
