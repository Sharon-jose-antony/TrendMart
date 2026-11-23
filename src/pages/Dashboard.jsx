import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentProducts from '../components/dashboard/RecentProducts';
import RecentOrders from '../components/dashboard/RecentOrders';
import QuickActions from '../components/dashboard/QuickActions';
import InventoryAlerts from '../components/dashboard/InventoryAlerts';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import StorePerformance from '../components/dashboard/StorePerformance';
import AddProductModal from '../components/dashboard/AddProductModal';
import { formatCurrency } from '../utils/formatters';
import {
  Package,
  Tags,
  Users,
  ShoppingBag,
} from 'lucide-react';

const Dashboard = () => {
  const {
    totalProducts,
    activeProducts,
    totalCategories,
    totalCustomers,
    totalOrders,
    totalRevenue,
  } = useData();

  const [selectedRange, setSelectedRange] = useState('7 Days');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {/* 1. Welcome Section */}
      <WelcomeSection
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
      />

      {/* 2. Four Premium Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle={`${activeProducts} active`}
          change="+8.4%"
          isPositive={true}
          icon={Package}
          accent="indigo"
        />
        <StatCard
          title="Total Categories"
          value={totalCategories}
          subtitle="Taxonomy active"
          change="+12.0%"
          isPositive={true}
          icon={Tags}
          accent="violet"
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          subtitle="94% satisfaction"
          change="+18.2%"
          isPositive={true}
          icon={Users}
          accent="emerald"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          subtitle={`Rev: ${formatCurrency(totalRevenue)}`}
          change="+14.5%"
          isPositive={true}
          icon={ShoppingBag}
          accent="amber"
        />
      </div>

      {/* 3. Sales Analytics Section */}
      <SalesChart
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
      />

      {/* 4. Quick Navigation Shortcuts */}
      <QuickActions
        onOpenAddProduct={() => setIsAddProductOpen(true)}
      />

      {/* 5. Recent Products & Recent Orders Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RecentProducts
          onOpenAddModal={() => setIsAddProductOpen(true)}
        />
        <RecentOrders />
      </div>

      {/* 6. Inventory Alerts & Activity Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <InventoryAlerts />
        </div>
        <div className="lg:col-span-1">
          <ActivityTimeline />
        </div>
      </div>

      {/* 7. Store Performance Summary */}
      <StorePerformance />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
    </motion.div>
  );
};

export default Dashboard;
