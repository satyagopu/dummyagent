import { motion } from 'framer-motion';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

export default function AppLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Header with Glass Effect */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    🤖 AgentWeave
                                </h1>
                            </motion.div>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/dashboard">
                                <Button variant="ghost" className="gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link to="/workflows">
                                <Button variant="ghost">Workflows</Button>
                            </Link>
                        </nav>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="hidden md:inline">{user?.email}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/settings" className="flex items-center cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
