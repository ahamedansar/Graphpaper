import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Save, ArrowLeft, Upload, Package, IndianRupee, Layers, Tag, FileText } from 'lucide-react';

const CATEGORIES = ['T-Shirts', 'Tracksuits', 'Sweatshirts', 'Hoodies', 'Jackets', 'Accessories', 'Shoes'];
const GENDERS = ['Men', 'Women', 'Kids', 'Unisex'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isNew = !id || id === 'new';

  const [form, setForm] = useState({
    name: '', category: 'T-Shirts', genderCategory: 'Men', description: '',
    price: '', countInStock: '', sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  });
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      api.get(`/products/${id}`)
        .then(({ data }) => {
          setForm({
            name: data.name || '',
            category: data.category || 'T-Shirts',
            genderCategory: data.genderCategory || 'Men',
            description: data.description || '',
            price: data.price || '',
            countInStock: data.countInStock ?? '',
            sizes: data.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
          });
          setImage(data.image || '');
          setImagePreview(data.image || '');
        })
        .catch(() => { toast.error('Product not found'); navigate('/admin/products'); })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' } };
      const { data } = await api.post('/upload', formData, config);
      setImage(data.url);
      setImagePreview(data.url);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { toast.error('Please upload a product image.'); return; }
    if (!form.name || !form.price || !form.description) { toast.error('Please fill all required fields.'); return; }
    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = { ...form, price: Number(form.price), countInStock: Number(form.countInStock), image };

      if (isNew) {
        await api.post('/products', payload, config);
        toast.success('Product created successfully!');
      } else {
        await api.put(`/products/${id}`, payload, config);
        toast.success('Product updated successfully!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner-border" style={{ color: '#4F46E5' }} />
    </div>
  );

  const inputStyle = { width: '100%', padding: '12px 14px', border: '1.5px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', outline: 'none', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748B', marginBottom: '7px' };
  const card = { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9', marginBottom: '20px' };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/admin/products')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', color: '#64748B' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div>
          <h1 style={{ fontWeight: '900', fontSize: '1.5rem', color: '#1E293B', margin: 0, letterSpacing: '-0.5px' }}>
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
          <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>{isNew ? 'Fill the details below to add a product.' : `Editing product #${id?.substring(0, 8)}`}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* LEFT: Image Upload */}
          <div>
            <div style={card}>
              <h3 style={{ fontWeight: '800', fontSize: '14px', color: '#1E293B', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={15} color="#4F46E5" /> Product Image
              </h3>

              {/* Image Preview */}
              <div style={{ height: '220px', backgroundColor: '#F0F4FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', overflow: 'hidden', border: '2px dashed #C7D2FE' }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#A5B4FC' }}>
                    <Package size={40} style={{ marginBottom: '8px' }} />
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>No image uploaded</p>
                  </div>
                )}
              </div>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: uploading ? '#E2E8F0' : '#EEF2FF', color: uploading ? '#94A3B8' : '#4F46E5', borderRadius: '12px', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px', transition: '0.2s' }}>
                <Upload size={16} />
                {uploading ? 'Uploading...' : imagePreview ? 'Change Image' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
              </label>
              {imagePreview && <p style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', marginTop: '8px' }}>Image uploaded successfully ✓</p>}
            </div>

            {/* Sizes */}
            <div style={card}>
              <h3 style={{ fontWeight: '800', fontSize: '14px', color: '#1E293B', margin: '0 0 16px' }}>Available Sizes</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SIZES.map(size => (
                  <button key={size} type="button" onClick={() => toggleSize(size)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '2px solid', borderColor: form.sizes.includes(size) ? '#4F46E5' : '#E2E8F0', backgroundColor: form.sizes.includes(size) ? '#EEF2FF' : '#F8FAFC', color: form.sizes.includes(size) ? '#4F46E5' : '#64748B', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: '0.2s' }}>
                    {size}
                  </button>
                ))}
              </div>
              {form.sizes.length === 0 && <p style={{ fontSize: '12px', color: '#E50010', marginTop: '8px', fontWeight: '700' }}>Select at least one size.</p>}
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div>
            <div style={card}>
              <h3 style={{ fontWeight: '800', fontSize: '14px', color: '#1E293B', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={15} color="#E50010" /> Product Details
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Product Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Premium Cotton T-Shirt" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4F46E5'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Gender *</label>
                  <select value={form.genderCategory} onChange={e => setForm(p => ({ ...p, genderCategory: e.target.value }))} style={inputStyle}>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Wholesale Price (₹) *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontWeight: '700' }}>₹</span>
                    <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" min="0" step="0.01" required style={{ ...inputStyle, paddingLeft: '28px' }}
                      onFocus={e => e.target.style.borderColor = '#16a34a'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Stock Count *</label>
                  <input type="number" value={form.countInStock} onChange={e => setForm(p => ({ ...p, countInStock: e.target.value }))} placeholder="0" min="0" required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#4F46E5'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the product quality, material, etc." rows={5} required
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                  onFocus={e => e.target.style.borderColor = '#4F46E5'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            </div>

            {/* Save Button */}
            <button type="submit" disabled={saving || uploading}
              style={{ width: '100%', padding: '15px', background: (saving || uploading) ? '#C7D2FE' : 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '15px', cursor: (saving || uploading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' }}>
              <Save size={16} /> {saving ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
