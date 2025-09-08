import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';

interface PendingUser {
  id: string;
  user_id: string;
  full_name: string;
  role: 'teacher' | 'admin' | 'principal';
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const UserManagement = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch pending users');
      console.error(error);
    } else {
      setPendingUsers((data || []) as PendingUser[]);
    }
    setLoading(false);
  };

  const updateUserStatus = async (userId: string, status: 'approved' | 'rejected', role?: 'teacher' | 'admin' | 'principal') => {
    const updates: any = { approval_status: status };
    if (role && status === 'approved') {
      updates.role = role;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      toast.error(`Failed to ${status} user`);
      console.error(error);
    } else {
      toast.success(`User ${status} successfully`);
      fetchPendingUsers();
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage pending user registrations and approvals</p>
        </div>
      </div>

      {pendingUsers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-2">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No Pending Users</h3>
              <p className="text-muted-foreground">All user registrations are up to date!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{user.full_name}</CardTitle>
                    <CardDescription>
                      Registered on {new Date(user.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(user.approval_status)}>
                    {user.approval_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Role:</span>
                      <span className="ml-2 capitalize">{user.role}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 capitalize">{user.approval_status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Assign Role:</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Select
                        defaultValue={user.role}
                        onValueChange={(role: 'teacher' | 'admin' | 'principal') => {
                          updateUserStatus(user.id, 'approved', role);
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="principal">Principal</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserStatus(user.id, 'approved', user.role)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserStatus(user.id, 'rejected')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;