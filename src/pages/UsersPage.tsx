import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { mockUsers } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Role, AppUser } from '@/types';

const roleColors: Record<Role, string> = {
  Admin: 'bg-destructive/10 text-destructive',
  FrontDesk: 'bg-primary/10 text-primary',
  User: 'bg-success/10 text-success',
  Employee: 'bg-warning/10 text-warning',
  Approver: 'bg-accent/10 text-accent',
  Visitor: 'bg-muted text-muted-foreground',
};

const UsersPage = () => {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);

  const updateRole = (userId: string, newRole: Role) => {
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    toast.success(`Role updated to ${newRole}`);
  };

  return (
    <AppLayout title="User Management">
      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Username</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Last Login</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.user_id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono font-medium">{u.username}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${roleColors[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.contact_info}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{u.last_login_at}</td>
                <td className="px-4 py-3">
                  <Select value={u.role} onValueChange={(val) => updateRole(u.user_id, val as Role)}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['Admin', 'FrontDesk', 'User', 'Employee', 'Approver', 'Visitor'] as Role[]).map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default UsersPage;
