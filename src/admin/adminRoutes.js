import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../backendConnection/context';

import AdminLayout from './adminLayout';
import AdminDashboard from './adminDashboard';
import AdminCarsList from './adminCars';
import AddCar from './adminAddCar';
import AdminCarEdit from './adminCarEdit';
import AdminReservations from './adminReservation';
import AdminSellRequests from './adminSellRequests';
import AdminUsers from './adminUsers';
import AdminContacts from './adminContacts';
import AdminSearchLogs from './adminSearchLog';

function AdminGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="admLoading">Duke ngarkuar...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function AdminRoutes() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route index element={<AdminDashboard />} />

          <Route path="cars" element={<AdminCarsList />} />
          <Route path="cars/add" element={<AddCar />} />
          <Route path="cars/:id/edit" element={<AdminCarEdit />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="sell-requests" element={<AdminSellRequests />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="searchLogs" element={<AdminSearchLogs />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </AdminGuard>
  );
}
