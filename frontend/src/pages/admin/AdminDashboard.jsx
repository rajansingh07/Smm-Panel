import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { Card, StatCard, Table, Badge, PageLoader } from '../../components/ui';
import {
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineCash,
  HiOutlineCollection,
  HiOutlineClock,
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending' },
      processing: { variant: 'info', label: 'Processing' },
      in_progress: { variant: 'info', label: 'In Progress' },
      completed: { variant: 'success', label: 'Completed' },
      partial: { variant: 'warning', label: 'Partial' },
      cancelled: { variant: 'danger', label: 'Cancelled' },
      refunded: { variant: 'danger', label: 'Refunded' },
    };

    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: '_id',
      title: 'Order ID',
      render: (id) => <span className="font-mono text-xs">#{id.slice(-8)}</span>,
    },
    {
      key: 'user',
      title: 'User',
      render: (_, row) => row.user?.name || 'N/A',
    },
    {
      key: 'service',
      title: 'Service',
      render: (_, row) => row.service?.title || 'N/A',
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (amount) => `₹${amount.toFixed(2)}`,
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => getStatusBadge(status),
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your SMM Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.users?.total || 0}
          icon={HiOutlineUsers}
          color="primary"
        />
        <StatCard
          title="Total Orders"
          value={stats?.orders?.total || 0}
          icon={HiOutlineShoppingCart}
          color="info"
        />
        <StatCard
          title="Pending Orders"
          value={stats?.orders?.pending || 0}
          icon={HiOutlineClock}
          color="warning"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.revenue?.total?.toFixed(2) || '0.00'}`}
          icon={HiOutlineCash}
          color="success"
        />
        <StatCard
          title="Active Services"
          value={stats?.services?.active || 0}
          icon={HiOutlineCollection}
          color="primary"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link
          to="/admin/orders"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <HiOutlineShoppingCart className="w-8 h-8 text-primary-600 mb-2" />
          <h3 className="font-semibold">View Orders</h3>
          <p className="text-sm text-gray-500">Manage all orders</p>
        </Link>
        <Link
          to="/admin/services"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <HiOutlineCollection className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="font-semibold">Manage Services</h3>
          <p className="text-sm text-gray-500">Add or edit services</p>
        </Link>
        <Link
          to="/admin/users"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <HiOutlineUsers className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-semibold">Manage Users</h3>
          <p className="text-sm text-gray-500">View and edit users</p>
        </Link>
        <Link
          to="/admin/add-funds"
          className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <HiOutlineCash className="w-8 h-8 text-yellow-600 mb-2" />
          <h3 className="font-semibold">Add Funds</h3>
          <p className="text-sm text-gray-500">Manual fund addition</p>
        </Link>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Today's Stats">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-gray-600">Orders Today</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats?.orders?.today || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Revenue Today</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{stats?.revenue?.today?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Orders by Status">
          <div className="space-y-3">
            {stats?.orders?.byStatus?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusBadge(item._id)}
                </div>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card
        title="Recent Orders"
        action={
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline">
            View All
          </Link>
        }
      >
        <Table
          columns={columns}
          data={stats?.recentOrders || []}
          emptyMessage="No recent orders"
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
