import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { Users, ShieldOff, Shield, Loader2, Search } from 'lucide-react'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [banning, setBanning] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.data || [])
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleBan = async (id, name, isBanned) => {
    const action = isBanned ? 'unban' : 'ban'
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${name}"?`)) return
    setBanning(id)
    try {
      const res = await api.put(`/admin/users/${id}/ban`)
      toast.success(res.data.message)
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, banned: res.data.data.banned } : u))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setBanning(null)
    }
  }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const roleColors = { ADMIN: 'bg-red-100 text-red-700', ORGANIZER: 'bg-purple-100 text-purple-700', STUDENT: 'bg-blue-100 text-blue-700' }

  return (
    <div className="page-shell">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">View and manage all registered users</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="input-field pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p className="text-sm text-slate-500">{filtered.length} users</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-10 h-10 text-cyan-700 animate-spin" /></div>
        ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-head">
                    <th className="px-4 py-3 text-left rounded-l-lg">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                    <th className="px-4 py-3 text-left rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className={`hover:bg-cyan-50/50 transition-colors ${u.banned ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3 font-medium text-slate-950">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[u.role]}`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.banned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {u.banned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-3">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleBan(u.id, u.name, u.banned)}
                            disabled={banning === u.id}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                              u.banned
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {banning === u.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : u.banned ? (
                              <Shield className="w-3 h-3" />
                            ) : (
                              <ShieldOff className="w-3 h-3" />
                            )}
                            {u.banned ? 'Unban' : 'Ban'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageUsers
