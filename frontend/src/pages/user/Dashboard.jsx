import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI, walletAPI } from '../../services/api';
import { Card, StatCard, Table, Badge, PageLoader } from '../../components/ui';
import {
  HiOutlineCreditCard,
  HiOutlineShoppingCart,
  HiOutlineClipboardList,
  HiOutlineClock,
} from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersRes = await ordersAPI.getAll({ limit: 5 });
      setOrders(ordersRes.data.data);
      
      // Calculate stats from orders
      const allOrdersRes = await ordersAPI.getAll({ limit: 1000 });
      const allOrders = allOrdersRes.data.data;
      
      setStats({
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter(o => ['pending', 'processing', 'in_progress'].includes(o.status)).length,
        completedOrders: allOrders.filter(o => o.status === 'completed').length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
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
    { key: '_id', title: 'Order ID', render: (id) => `#${id.slice(-8)}` },
    {
      key: 'service',
      title: 'Service',
      render: (_, row) => row.service?.title || 'N/A',
    },
    { key: 'quantity', title: 'Quantity' },
    { key: 'amount', title: 'Amount', render: (amount) => `₹${amount.toFixed(2)}` },
    { key: 'status', title: 'Status', render: (status) => getStatusBadge(status) },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your orders today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Wallet Balance"
          value={`₹${user?.walletBalance?.toFixed(2) || '0.00'}`}
          icon={HiOutlineCreditCard}
          color="primary"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={HiOutlineShoppingCart}
          color="info"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={HiOutlineClock}
          color="warning"
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders}
          icon={HiOutlineClipboardList}
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/new-order"
          className="bg-primary-600 text-white rounded-xl p-6 hover:bg-primary-700 transition-colors"
        >
          <HiOutlineShoppingCart className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold">Place New Order</h3>
          <p className="text-primary-100 mt-1">Order SMM services quickly</p>
        </Link>
        <Link
          to="/add-funds"
          className="bg-green-600 text-white rounded-xl p-6 hover:bg-green-700 transition-colors"
        >
          <HiOutlineCreditCard className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold">Add Funds</h3>
          <p className="text-green-100 mt-1">Top up your wallet balance</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <Card
        title="Recent Orders"
        action={
          <Link
            to="/orders"
            className="text-sm text-primary-600 hover:underline"
          >
            View All
          </Link>
        }
      >
        <Table
          columns={columns}
          data={orders}
          emptyMessage="No orders yet. Place your first order!"
        />
      </Card>
    </div>
  );
};

export default Dashboard;
