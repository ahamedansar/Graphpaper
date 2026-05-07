import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { MessageSquare, Star, CheckCircle, Clock, Trash2, Mail, Phone, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';

const FeedbackList = () => {
    const { user } = useContext(AuthContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    const fetchFeedbacks = async () => {
        try {
            const { data } = await api.get('/feedback', config);
            setFeedbacks(data);
        } catch (err) {
            toast.error('Failed to fetch feedbacks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [user]);

    const markAsReadHandler = async (id) => {
        try {
            await api.put(`/feedback/${id}/read`, {}, config);
            toast.success('Marked as read');
            fetchFeedbacks();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><div className="spinner-border text-primary"></div></div>;

    const unreadCount = feedbacks.filter(f => !f.isRead).length;

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontWeight: '900', fontSize: '1.75rem', color: '#1E293B', marginBottom: '8px', letterSpacing: '-0.5px' }}>User Feedbacks</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '15px' }}>Manage and review building partnership responses.</p>
                </div>
                <div style={{ backgroundColor: unreadCount > 0 ? '#FEE2E2' : '#F1F5F9', color: unreadCount > 0 ? '#E50010' : '#64748B', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '700' }}>
                    {unreadCount} Unread Feedbacks
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
                {feedbacks.map(feedback => (
                    <div key={feedback._id} style={{ backgroundColor: '#fff', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', position: 'relative', opacity: feedback.isRead ? 0.7 : 1 }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', backgroundColor: feedback.isRead ? '#F1F5F9' : '#EEF2FF', color: feedback.isRead ? '#94A3B8' : '#4F46E5', borderRadius: '100px', fontSize: '11px', fontWeight: '800' }}>
                                {feedback.isRead ? <CheckCircle size={12} /> : <Clock size={12} />}
                                {feedback.isRead ? 'Reviewed' : 'New Feedback'}
                            </div>
                            <div style={{ display: 'flex' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} size={14} fill={feedback.rating >= star ? '#FACC15' : 'none'} color={feedback.rating >= star ? '#FACC15' : '#DDD'} />
                                ))}
                            </div>
                        </div>

                        <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1E293B', marginBottom: '12px' }}>{feedback.category}</h3>
                        <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px', fontStyle: 'italic' }}>"{feedback.message}"</p>

                        <div style={{ borderTop: '1px solid #F8FAFC', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748B', fontSize: '13px' }}>
                                <User size={14} /> <span style={{ fontWeight: '600', color: '#334155' }}>{feedback.name}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748B', fontSize: '13px' }}>
                                <Mail size={14} /> <span>{feedback.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748B', fontSize: '13px' }}>
                                <Calendar size={14} /> <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {!feedback.isRead && (
                            <button onClick={() => markAsReadHandler(feedback._id)} style={{ marginTop: '24px', width: '100%', backgroundColor: '#F1F5F9', border: 'none', padding: '10px', borderRadius: '100px', fontSize: '13px', fontWeight: '700', color: '#4F46E5' }}>
                                Mark as Reviewed
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {feedbacks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px', color: '#94A3B8' }}>
                    <MessageSquare size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <h5>No feedbacks yet</h5>
                </div>
            )}
        </div>
    );
};

export default FeedbackList;
