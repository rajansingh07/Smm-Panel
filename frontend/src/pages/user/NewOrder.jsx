import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesAPI, ordersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input, Select, PageLoader } from '../../components/ui';
import toast from 'react-hot-toast';

const NewOrder = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    serviceId: '',
    link: '',
    quantity: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.data);
      const uniqueCategories = [...new Set(response.data.data.map((s) => s.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  const handleServiceChange = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    setSelectedService(service);
    setFormData((prev) => ({
      ...prev,
      serviceId,
      quantity: service?.min?.toString() || '',
    }));
  };

  const calculateTotal = () => {
    if (!selectedService || !formData.quantity) return 0;
    return (selectedService.rate / 1000) * parseInt(formData.quantity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceId || !formData.link || !formData.quantity) {
      toast.error('Please fill all fields');
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (quantity < selectedService.min || quantity > selectedService.max) {
      toast.error(`Quantity must be between ${selectedService.min} and ${selectedService.max}`);
      return;
    }

    const total = calculateTotal();
    if (total > user.walletBalance) {
      toast.error('Insufficient balance. Please add funds.');
      return;
    }

    setSubmitting(true);

    try {
      await ordersAPI.create({
        serviceId: formData.serviceId,
        link: formData.link,
        quantity,
      });

      // Update user balance
      updateUser({ walletBalance: user.walletBalance - total });

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Order</h1>
        <p className="text-gray-500 mt-1">Place a new SMM service order</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <Select
            label="Category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedService(null);
              setFormData((prev) => ({ ...prev, serviceId: '', quantity: '' }));
            }}
            placeholder="Select a category"
            options={categories.map((cat) => ({ value: cat, label: cat }))}
          />

          {/* Service */}
          <Select
            label="Service"
            value={formData.serviceId}
            onChange={(e) => handleServiceChange(e.target.value)}
            placeholder="Select a service"
            options={filteredServices.map((service) => ({
              value: service._id,
              label: `${service.title} - ₹${service.rate}/1000`,
            }))}
          />

          {/* Service Details */}
          {selectedService && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Service Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Rate:</span>
                  <span className="ml-2 font-medium">₹{selectedService.rate}/1000</span>
                </div>
                <div>
                  <span className="text-gray-500">Min:</span>
                  <span className="ml-2 font-medium">{selectedService.min}</span>
                </div>
                <div>
                  <span className="text-gray-500">Max:</span>
                  <span className="ml-2 font-medium">{selectedService.max}</span>
                </div>
              </div>
            </div>
          )}

          {/* Link */}
          <Input
            label="Link"
            type="url"
            placeholder="Enter the target link"
            value={formData.link}
            onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
            required
          />

          {/* Quantity */}
          <Input
            label="Quantity"
            type="number"
            placeholder={`Enter quantity (${selectedService?.min || 0} - ${selectedService?.max || 0})`}
            value={formData.quantity}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
            min={selectedService?.min}
            max={selectedService?.max}
            required
          />

          {/* Order Summary */}
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-primary-600">
                  ₹{calculateTotal().toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Your Balance</p>
                <p className={`text-lg font-semibold ${user.walletBalance >= calculateTotal() ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{user.walletBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            loading={submitting}
            className="w-full"
            size="lg"
            disabled={!selectedService || calculateTotal() > user.walletBalance}
          >
            Place Order
          </Button>

          {calculateTotal() > user.walletBalance && (
            <p className="text-center text-sm text-red-500">
              Insufficient balance.{' '}
              <a href="/add-funds" className="underline">
                Add funds
              </a>
            </p>
          )}
        </form>
      </Card>
    </div>
  );
};

export default NewOrder;
