import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { messService } from '../../services/messService';
import Modal from '../../components/Modal';
import { Utensils, PlusCircle, Eye, Trash2, Edit2 } from 'lucide-react';

const MessManagement = () => {
  const [messList, setMessList] = useState([]);
  const [loading, setLoading] = useState(true);

  // New/Edit Mess Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMess, setEditingMess] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [contactNumber, setContactNumber] = useState('');
  const [foodType, setFoodType] = useState('Veg');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [dailyPrice, setDailyPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMess = async () => {
    try {
      setLoading(true);
      const res = await messService.getMessServices({ limit: 50 });
      if (res.success) {
        setMessList(res.data || []);
      }
    } catch (err) {
      console.error('Fetch mess admin error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMess();
  }, []);

  const openAddModal = () => {
    setEditingMess(null);
    setName('');
    setDescription('');
    setAddress('');
    setLocality('');
    setCity('Bangalore');
    setContactNumber('');
    setFoodType('Veg');
    setMonthlyPrice('');
    setDailyPrice('');
    setModalOpen(true);
  };

  const openEditModal = (m) => {
    setEditingMess(m);
    setName(m.name || '');
    setDescription(m.description || '');
    setAddress(m.address || '');
    setLocality(m.locality || '');
    setCity(m.city || '');
    setContactNumber(m.contactNumber || '');
    setFoodType(m.foodType || 'Veg');
    setMonthlyPrice(m.monthlyPrice?.toString() || '');
    setDailyPrice(m.dailyPrice?.toString() || '');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mess service?')) return;
    try {
      await messService.deleteMessService(id);
      fetchMess();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name,
        description,
        address,
        locality,
        city,
        contactNumber,
        foodType,
        monthlyPrice: Number(monthlyPrice),
        dailyPrice: Number(dailyPrice) || 0,
      };

      if (editingMess) {
        await messService.updateMessService(editingMess._id, payload);
      } else {
        await messService.createMessService(payload);
      }
      setModalOpen(false);
      fetchMess();
    } catch (err) {
      alert(err.message || 'Failed to save mess service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Mess & Tiffin Management</h1>
          <p>Create and maintain student dining services and weekly subscription listings.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add Mess Listing</span>
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div className="spinner"></div>
        ) : messList.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Dietary Type</th>
                  <th>Monthly & Daily Price</th>
                  <th>Contact Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messList.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{m.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {m.locality}, {m.city}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${m.foodType === 'Veg' ? 'badge-success' : 'badge-danger'}`}>
                        {m.foodType}
                      </span>
                    </td>
                    <td>
                      <div><strong>₹{m.monthlyPrice?.toLocaleString()}</strong> / mo</div>
                      {m.dailyPrice ? (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ₹{m.dailyPrice} / thali
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <div>{m.contactNumber}</div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/mess/${m._id}`} className="btn btn-outline btn-sm" title="View Public Page">
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => openEditModal(m)}
                          className="btn btn-outline btn-sm"
                          title="Edit Service"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Delete Service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Utensils className="empty-state-icon" />
            <h3>No mess services found</h3>
            <p>Add a new mess or tiffin listing to show on the public directory.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Mess Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMess ? 'Edit Mess Listing' : 'Add New Mess Service'}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={submitting} onClick={handleFormSubmit}>
              {submitting ? 'Saving...' : editingMess ? 'Save Changes' : 'Create Mess Listing'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Service Name *</label>
            <input
              type="text"
              placeholder="e.g. Annapurna Homestyle Veg Mess"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              placeholder="Describe food hygiene, ingredients used, special weekend menus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={3}
              required
            ></textarea>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Locality / Area *</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Street Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Food Type</label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="form-select"
              >
                <option value="Veg">Pure Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Both">Both Veg & Non-Veg</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Price (₹) *</label>
              <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Daily Price (₹)</label>
              <input
                type="number"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone Number *</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MessManagement;
