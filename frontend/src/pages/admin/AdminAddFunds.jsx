import { useState } from 'react';
import { adminAPI, walletAPI } from '../../services/api';
import { Card, Button, Input } from '../../components/ui';
import { HiOutlineSearch, HiOutlineCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminAddFunds = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;

    setSearching(true);
    setUser(null);

    try {
      const response = await adminAPI.getUsers({ search: searchEmail, limit: 1 });
      if (response.data.data.length > 0) {
        setUser(response.data.data[0]);
      } else {
        toast.error('User not found');
      }
    } catch (error) {
      toast.error('Failed to search user');
    } finally {
      setSearching(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setSubmitting(true);

    try {
      const response = await walletAPI.adminAddFunds({
        userId: user._id,
        amount: amountNum,
        description: description || `Manual addition by admin`,
      });

      toast.success(`₹${amountNum} added to ${user.name}'s wallet`);
      setUser({
        ...user,
        walletBalance: response.data.data.newBalance,
      });
      setAmount('');
      setDescription('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add funds');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Funds Manually</h1>
        <p className="text-gray-500 mt-1">Add funds to a user's wallet</p>
      </div>

      {/* Search User */}
      <Card title="Search User" className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Enter user email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
          <Button type="submit" loading={searching}>
            <HiOutlineSearch className="w-5 h-5 mr-2" />
            Search
          </Button>
        </form>
      </Card>

      {/* User Found */}
      {user && (
        <Card title="User Details">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-2xl font-bold text-primary-600">
                  ₹{user.walletBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAddFunds} className="space-y-4">
            <Input
              label="Amount to Add (₹)"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              label="Description (Optional)"
              placeholder="Reason for adding funds"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Preview */}
            {amount && parseFloat(amount) > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">New Balance After Addition</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{(user.walletBalance + parseFloat(amount)).toFixed(2)}
                </p>
              </div>
            )}

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              <HiOutlineCheck className="w-5 h-5 mr-2" />
              Add Funds
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default AdminAddFunds;
