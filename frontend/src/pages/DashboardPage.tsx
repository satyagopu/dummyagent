import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Edit, Trash2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Types
export interface Workflow {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'error';
    last_run: string;
    executions_count: number;
    created_at: string;
}

interface WorkflowStats {
    total: number;
    active: number;
    totalExecutions: number;
}

// Constants
const ANIMATION_DURATION = 0.6;
const STAGGER_DELAY = 0.1;

// Helper Functions
const calculateWorkflowStats = (workflows: Workflow[]): WorkflowStats => ({
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    totalExecutions: workflows.reduce((sum, w) => sum + w.executions_count, 0),
});

const getStatusConfig = (status: Workflow['status']) => {
    const configs = {
        active: {
            variant: 'default' as const,
            icon: Play,
            label: 'Active',
            className: 'bg-primary text-primary-foreground',
        },
        inactive: {
            variant: 'outline' as const,
            icon: Clock,
            label: 'Inactive',
            className: '',
        },
        error: {
            variant: 'destructive' as const,
            icon: AlertCircle,
            label: 'Error',
            className: '',
        },
    };
    return configs[status];
};

// Sub-components
const StatusBadge = ({ status }: { status: Workflow['status'] }) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={config.className}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
        </Badge>
    );
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
    <Card className="shadow-accent">
        <CardHeader className="pb-3">
            <CardDescription>{title}</CardDescription>
            <CardTitle className="text-3xl">{value}</CardTitle>
        </CardHeader>
    </Card>
);

const WorkflowCard = ({ workflow, index }: { workflow: Workflow; index: number }) => {
    const handleDelete = () => {
        toast.error('Delete not implemented yet');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: ANIMATION_DURATION, delay: index * STAGGER_DELAY }}
        >
            <Card className="shadow-accent hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="mb-2">{workflow.name}</CardTitle>
                            <CardDescription>{workflow.description}</CardDescription>
                        </div>
                        <StatusBadge status={workflow.status} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Last run:</span>
                            <span>{workflow.last_run}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Executions:</span>
                            <span className="font-medium">{workflow.executions_count}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Link to={`/workflows/${workflow.id}/edit`} className="flex-1">
                                <Button variant="outline" className="w-full gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleDelete}
                                aria-label="Delete workflow"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const EmptyState = () => (
    <Card className="shadow-accent">
        <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
                No workflows yet. Create your first AI workflow!
            </p>
            <Link to="/workflows/new">
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                </Button>
            </Link>
        </CardContent>
    </Card>
);

const LoadingState = () => (
    <div className="text-center py-12">
        <p className="text-muted-foreground">Loading workflows...</p>
    </div>
);

// Main Component
export default function DashboardPage() {
    const { user } = useAuthStore();
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);

    // Memoized stats calculation
    const stats = useMemo(() => calculateWorkflowStats(workflows), [workflows]);

    // User display name
    const displayName = user?.full_name || user?.email || 'there';

    useEffect(() => {
        // TODO: Replace with actual API call
        const fetchWorkflows = async () => {
            try {
                // Simulating API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockWorkflows: Workflow[] = [
                    {
                        id: '1',
                        name: 'Customer Support Agent',
                        description: 'AI-powered customer support chatbot',
                        status: 'active',
                        last_run: '2 hours ago',
                        executions_count: 450,
                        created_at: '2026-01-15',
                    },
                    {
                        id: '2',
                        name: 'Email Assistant',
                        description: 'Automated email responses',
                        status: 'active',
                        last_run: '1 day ago',
                        executions_count: 120,
                        created_at: '2026-01-20',
                    },
                ];

                setWorkflows(mockWorkflows);
            } catch (error) {
                toast.error('Failed to load workflows');
                console.error('Error fetching workflows:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkflows();
    }, []);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION }}
            >
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Welcome back, {displayName}! 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                    Manage your AI workflows and deployments
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                className="grid gap-6 md:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION, delay: 0.1 }}
            >
                <StatCard title="Total Workflows" value={stats.total} />
                <StatCard title="Active Deployments" value={stats.active} />
                <StatCard title="Total Executions" value={stats.totalExecutions} />
            </motion.div>

            {/* Workflows Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Your Workflows</h2>
                    <Link to="/workflows/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Workflow
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <LoadingState />
                ) : workflows.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {workflows.map((workflow, index) => (
                            <WorkflowCard key={workflow.id} workflow={workflow} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
