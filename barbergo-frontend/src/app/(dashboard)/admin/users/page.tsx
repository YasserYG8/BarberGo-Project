"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminUsers, deleteAdminUser, updateAdminUserRole } from "@/lib/domain/admin";
import { useToast } from "@/components/ui/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RowSkeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Trash2, Search } from "lucide-react";
import type { User } from "@/types";

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    try {
      const res = await getAdminUsers();
      setUsers(res || []);
    } catch {
      toast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setIsDeleting(true);
    try {
      await deleteAdminUser(deleteUserId);
      toast("User deleted successfully", "success");
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete user";
      toast(message, "error");
    } finally {
      setIsDeleting(false);
      setDeleteUserId(null);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await updateAdminUserRole(userId, newRole);
      toast("User role updated", "success");
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update role";
      toast(message, "error");
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const name = u.fullName?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    return name.includes(term) || email.includes(term);
  });

  return (
    <>
      {deleteUserId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-stone-100 mb-2">Delete User</h3>
            <p className="text-stone-400 text-sm mb-6">Are you sure you want to delete this user? This will also remove any of their bookings and profiles. This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteUserId(null)} disabled={isDeleting}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete User"}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-stone-50">
              Platform <span className="text-gradient-gold">Users</span>
            </h1>
            <p className="text-stone-400 mt-1">Manage user roles and accounts.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 bg-stone-900 border-stone-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>
              {searchTerm ? `Found ${filteredUsers.length} users` : `${users.length} users on the platform`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3"><RowSkeleton /><RowSkeleton /><RowSkeleton /></div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center py-6 text-stone-500">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-500 uppercase text-xs tracking-wider">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-center py-3 px-4">Status</th>
                      <th className="text-center py-3 px-4">Role</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-stone-800/50 hover:bg-stone-800/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-stone-200">{u.fullName}</td>
                        <td className="py-3 px-4 text-stone-400">{u.email}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs ${u.enabled ? "text-emerald-400" : "text-stone-600"}`}>
                            {u.enabled ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select
                            className={`bg-stone-900 border text-xs px-2 py-1 rounded-md cursor-pointer outline-none ${
                              u.role === "ADMIN"
                                ? "text-violet-400 border-violet-500/20 bg-violet-500/10"
                                : u.role === "HAIRDRESSER"
                                ? "text-amber-400 border-amber-500/20 bg-amber-500/10"
                                : "text-blue-400 border-blue-500/20 bg-blue-500/10"
                            }`}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          >
                            <option value="CLIENT" className="bg-stone-900 text-stone-200">CLIENT</option>
                            <option value="HAIRDRESSER" className="bg-stone-900 text-stone-200">HAIRDRESSER</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="destructive" size="sm" onClick={() => setDeleteUserId(u.id)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
