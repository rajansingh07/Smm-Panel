import { useState, useEffect } from 'react';
import { walletAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input, Table, Badge, Pagination, PageLoader } from '../../components/ui';
import toast from 'react-hot-toast';

const AddFunds = () => {
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  useEffect(() => {
    fetchTransactionHistory();
  }, [pagination.page]);

  const fetchTransactionHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await walletAPI.getHistory({
        page: pagination.page,
        limit: 10,
      });
      setTransactions(response.data.data);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handlePayment = async () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 10) {
      toast.error('Minimum amount is ₹10');
      return;
    }

    setLoading(true);

    try {
      const response = await walletAPI.createPaymentOrder(amountNum);
      const { orderId, keyId } = response.data.data;

      const options = {
        key: keyId,
        amount: amountNum * 100,
        currency: 'INR',
        name: 'SMM Panel',
        description: 'Wallet Recharge',
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await walletAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            updateUser({ walletBalance: verifyResponse.data.data.newBalance });
            toast.success('Payment successful!');
            setAmount('');
            fetchTransactionHistory();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'type',
      title: 'Type',
      render: (type) => (
        <Badge variant={type === 'credit' ? 'success' : 'danger'}>
          {type === 'credit' ? 'Credit' : 'Debit'}
        </Badge>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (amount, row) => (
        <span className={row.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
          {row.type === 'credit' ? '+' : '-'}₹{amount.toFixed(2)}
        </span>
      ),
    },
    { key: 'description', title: 'Description' },
    {
      key: 'balanceAfter',
      title: 'Balance After',
      render: (balance) => `₹${balance.toFixed(2)}`,
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Funds</h1>
        <p className="text-gray-500 mt-1">Add money to your wallet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Funds Card */}
        <div className="lg:col-span-1">
          <Card title="Add Funds">
            {/* Current Balance */}
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-3xl font-bold text-primary-600">
                ₹{user?.walletBalance?.toFixed(2) || '0.00'}
              </p>
            </div>

            {/* Amount Input */}
            <Input
              label="Amount (₹)"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
            />

            {/* Quick Amounts */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              loading={loading}
              className="w-full mt-6"
              size="lg"
            >
              Pay with Razorpay
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Minimum amount: ₹10
            </p>
          </Card>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <Card title="Transaction History">
            {historyLoading ? (
              <PageLoader />
            ) : (
              <>
                <Table
                  columns={columns}
                  data={transactions}
                  emptyMessage="No transactions yet"
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
      </div>
    </div>
  );
};

export default AddFunds;
