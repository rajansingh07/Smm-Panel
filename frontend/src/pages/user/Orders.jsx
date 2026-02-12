import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import { Card, Table, Badge, Pagination, Select, PageLoader } from '../../components/ui';

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll({
        page: pagination.page,
        limit: 20,
        status: statusFilter || undefined,
      });
      setOrders(response.data.data);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
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
      render: (id) => (
        <span className="font-mono text-xs">#{id.slice(-8)}</span>
      ),
    },
    {
      key: 'service',
      title: 'Service',
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.service?.title || 'N/A'}</p>
          <p className="text-xs text-gray-500">{row.service?.category}</p>
        </div>
      ),
    },
    {
      key: 'link',
      title: 'Link',
      render: (link) => (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:underline truncate block max-w-[200px]"
        >
          {link}
        </a>
      ),
    },
    { key: 'quantity', title: 'Quantity' },
    {
      key: 'amount',
      title: 'Amount',
      render: (amount) => <span className="font-medium">₹{amount.toFixed(2)}</span>,
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => getStatusBadge(status),
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'partial', label: 'Partial' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
  ];

  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-500 mt-1">View all your orders</p>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            options={statusOptions}
          />
        </div>
      </div>

      <Card>
        {loading ? (
          <PageLoader />
        ) : (
          <>
            <Table
              columns={columns}
              data={orders}
              emptyMessage="No orders found"
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default Orders;
