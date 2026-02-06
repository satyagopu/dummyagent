import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

interface Credential {
    id: number;
    provider: string;
    masked_key: string;
    is_active: boolean;
    created_at: string;
}

export default function SettingsPage() {
    const { token, user } = useAuthStore();
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [provider, setProvider] = useState('openai');
    const [apiKey, setApiKey] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        fetchCredentials();
    }, []);

    const fetchCredentials = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/settings/credentials', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCredentials(response.data);
        } catch (error) {
            toast.error("Failed to load credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!apiKey) {
            toast.error("Please enter an API key");
            return;
        }
        setVerifying(true);
        try {
            await axios.post('http://localhost:8000/api/settings/credentials/verify',
                { provider, api_key: apiKey },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Key is valid! ✅");
            saveCredential();
        } catch (error) {
            toast.error("Invalid API Key ❌");
        } finally {
            setVerifying(false);
        }
    };

    const saveCredential = async () => {
        try {
            await axios.post('http://localhost:8000/api/settings/credentials',
                { provider, api_key: apiKey },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Credential saved securely");
            setApiKey('');
            fetchCredentials();
        } catch (error) {
            toast.error("Failed to save credential");
        }
    };

    const handleDelete = async (providerToDelete: string) => {
        try {
            await axios.delete(`http://localhost:8000/api/settings/credentials/${providerToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Key removed");
            setCredentials(prev => prev.filter(c => c.provider !== providerToDelete));
        } catch (error) {
            toast.error("Failed to delete credential");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and AI credentials.</p>
                </div>
            </div>

            <Tabs defaultValue="credentials" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="credentials">Credentials & keys</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>

                <TabsContent value="credentials" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Provider Keys</CardTitle>
                            <CardDescription>
                                Add your API keys here. They are encrypted at rest and used only for your workflows.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Add New Key Form */}
                            <div className="flex flex-col sm:flex-row gap-4 items-end border-b pb-6">
                                <div className="space-y-2 w-full sm:w-[200px]">
                                    <Label>Provider</Label>
                                    <Select value={provider} onValueChange={setProvider}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                                            <SelectItem value="google">Google (Gemini)</SelectItem>
                                            <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex-1 w-full">
                                    <Label>API Key</Label>
                                    <div className="relative">
                                        <Input
                                            type={showKey ? "text" : "password"}
                                            placeholder="sk-..."
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowKey(!showKey)}
                                            data-testid="toggle-visibility"
                                        >
                                            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <Button onClick={handleVerify} disabled={verifying || !apiKey}>
                                    {verifying ? "Verifying..." : "Verify & Save"}
                                </Button>
                            </div>

                            {/* Existing Keys List */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium">Active Credentials</h3>
                                {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
                                {!loading && credentials.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">No credentials configured.</p>
                                )}
                                <div className="grid gap-4">
                                    {credentials.map((cred) => (
                                        <div key={cred.id} className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    {cred.provider === 'openai' && '🤖'}
                                                    {cred.provider === 'google' && '🌟'}
                                                    {cred.provider === 'anthropic' && '🧠'}
                                                </div>
                                                <div>
                                                    <p className="font-medium capitalize">{cred.provider}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{cred.masked_key}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90" onClick={() => handleDelete(cred.provider)} data-testid={`delete-${cred.provider}`}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={user?.email || ''} disabled />
                            </div>
                            <p className="text-sm text-muted-foreground">Password reset functionality coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
