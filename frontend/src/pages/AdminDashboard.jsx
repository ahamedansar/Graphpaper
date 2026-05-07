import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await api.get('/admin/stats', config);
        setStats(data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load admin dashboard statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (loading) return <Loader message="Compiling wholesale metrics..." />;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="py-4">
      <div className="mb-5 border-bottom pb-4">
        <h2 className="display-6 fw-bold mb-1">Admin Dashboard</h2>
        <p className="text-muted mb-0">Platform overview and high-level analytics for Graphpaper.</p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-effect" style={{ borderLeft: '4px solid var(--accent-color)' }}>
             <div className="d-flex justify-content-between align-items-center mb-3">
               <h6 className="text-uppercase text-muted fw-bold small mb-0" style={{ letterSpacing: '1px' }}>Total Revenue</h6>
               <div className="bg-light p-2 rounded-circle"><DollarSign size={20} className="text-success" /></div>
             </div>
             <h3 className="display-6 fw-bold mb-0">${stats.revenue?.toLocaleString() || 0}</h3>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-effect" style={{ borderLeft: '4px solid var(--primary-color)' }}>
             <div className="d-flex justify-content-between align-items-center mb-3">
               <h6 className="text-uppercase text-muted fw-bold small mb-0" style={{ letterSpacing: '1px' }}>Total Orders</h6>
               <div className="bg-light p-2 rounded-circle"><ShoppingBag size={20} className="text-primary" /></div>
             </div>
             <h3 className="display-6 fw-bold mb-0">{stats.orders || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-effect" style={{ borderLeft: '4px solid #f59e0b' }}>
             <div className="d-flex justify-content-between align-items-center mb-3">
               <h6 className="text-uppercase text-muted fw-bold small mb-0" style={{ letterSpacing: '1px' }}>Retailers</h6>
               <div className="bg-light p-2 rounded-circle"><Users size={20} style={{ color: '#f59e0b' }} /></div>
             </div>
             <h3 className="display-6 fw-bold mb-0">{stats.users || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-effect" style={{ borderLeft: '4px solid #6366f1' }}>
             <div className="d-flex justify-content-between align-items-center mb-3">
               <h6 className="text-uppercase text-muted fw-bold small mb-0" style={{ letterSpacing: '1px' }}>Catalog Items</h6>
               <div className="bg-light p-2 rounded-circle"><Package size={20} style={{ color: '#6366f1' }} /></div>
             </div>
             <h3 className="display-6 fw-bold mb-0">{stats.products || 0}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
           <div className="card shadow-sm border-0 rounded-4 p-4 bg-white mb-4">
             <h5 className="fw-bold mb-4">Monthly Sales Report</h5>
             {stats.salesByMonth && stats.salesByMonth.length > 0 ? (
               <div className="table-responsive">
                 <table className="table table-hover align-middle">
                   <thead className="table-light text-muted small text-uppercase">
                     <tr>
                       <th>Month</th>
                       <th>Orders Placed</th>
                       <th className="text-end">Total Volume</th>
                     </tr>
                   </thead>
                   <tbody>
                     {stats.salesByMonth.map(item => (
                       <tr key={item._id}>
                         <td className="fw-semibold">{monthNames[item._id - 1] || `Month ${item._id}`}</td>
                         <td>{item.count}</td>
                         <td className="text-end fw-bold text-success">${item.totalSales?.toFixed(2)}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="text-center py-4 bg-light rounded text-muted">No sales data available yet to generate report.</div>
             )}
           </div>
        </div>
        
        <div className="col-lg-4">
           <div className="card shadow-sm border-0 rounded-4 p-4 bg-primary text-white h-100 placeholder-glow position-relative overflow-hidden">
             <div className="position-absolute" style={{ top: '-20px', right: '-20px', opacity: 0.1 }}><Users size={150} /></div>
             <h5 className="fw-bold mb-3 position-relative z-1">Quick Actions</h5>
             <div className="d-flex flex-column gap-3 position-relative z-1">
               <button className="btn btn-light w-100 fw-semibold text-start shadow-sm">Manage Retailers &rarr;</button>
               <button className="btn btn-outline-light w-100 fw-semibold text-start">View Inventory &rarr;</button>
               <button className="btn btn-outline-light w-100 fw-semibold text-start">Order Fulfillment &rarr;</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
