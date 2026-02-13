import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remindersAPI } from '../services/api';
import { useAppStore } from '../store';
import type { Reminder } from '../types';
import './RemindersPage.css';

export default function RemindersPage() {
  const queryClient = useQueryClient();
  const { reminders, setReminders } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Reminder, '_id'>>({
    title: '',
    description: '',
    time: '07:00',
    days: [],
    prayerType: 'custom',
    enabled: true
  });

  const { data: fetchedReminders } = useQuery({
    queryKey: ['reminders'],
    queryFn: remindersAPI.getAll
  });

  // Update local store when fetched data changes
  useEffect(() => {
    if (fetchedReminders) {
      setReminders(fetchedReminders);
    }
  }, [fetchedReminders, setReminders]);

  const createMutation = useMutation({
    mutationFn: remindersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reminder> }) =>
      remindersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: remindersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      time: '07:00',
      days: [],
      prayerType: 'custom',
      enabled: true
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      time: reminder.time,
      days: reminder.days,
      prayerType: reminder.prayerType,
      enabled: reminder.enabled
    });
    setEditingId(reminder._id || null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day as any)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day as any]
    }));
  };

  const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const prayerTypes = [
    { value: 'morning', label: '🌅 Morning Prayer' },
    { value: 'evening', label: '🌙 Evening Prayer' },
    { value: 'rosary', label: '📿 Rosary' },
    { value: 'angelus', label: '🔔 Angelus' },
    { value: 'divine-mercy', label: '✝️ Divine Mercy' },
    { value: 'custom', label: '📝 Custom' }
  ];

  const displayedReminders = fetchedReminders || reminders;

  return (
    <div className="reminders-page">
      <div className="reminders-header">
        <div>
          <h1><span aria-hidden="true">⏰</span> Prayer Reminders</h1>
          <p>Never miss your daily prayers</p>
        </div>
        <button className="btn-add" onClick={() => setShowForm(!showForm)} aria-label={showForm ? 'Cancel adding reminder' : 'Add new reminder'}>
          {showForm ? '✕ Cancel' : '+ Add Reminder'}
        </button>
      </div>

      {showForm && (
        <div className="reminder-form-container">
          <form className="reminder-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Reminder' : 'New Reminder'}</h3>

            <div className="form-group">
              <label htmlFor="reminder-title">Title *</label>
              <input
                id="reminder-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Morning Prayer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reminder-description">Description</label>
              <textarea
                id="reminder-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional note..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prayer-type">Prayer Type</label>
              <select
                id="prayer-type"
                value={formData.prayerType}
                onChange={(e) => setFormData({ ...formData, prayerType: e.target.value as any })}
              >
                {prayerTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reminder-time">Time *</label>
              <input
                id="reminder-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label id="days-label">Repeat on days</label>
              <div className="days-selector" role="group" aria-labelledby="days-label">
                {allDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`day-button ${formData.days.includes(day as any) ? 'active' : ''}`}
                    onClick={() => toggleDay(day)}
                    aria-label={day}
                    aria-pressed={formData.days.includes(day as any)}
                  >
                    {day.substring(0, 3).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Update' : 'Create'} Reminder
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteConfirmId && (
        <div className="delete-confirmation" role="dialog" aria-labelledby="delete-dialog-title" aria-modal="true">
          <div className="delete-dialog">
            <h3 id="delete-dialog-title">Delete Reminder?</h3>
            <p>Are you sure you want to delete this reminder? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn-confirm-delete" onClick={confirmDelete}>Delete</button>
              <button className="btn-cancel" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="reminders-list">
        {displayedReminders.length === 0 ? (
          <div className="empty-state">
            <p><span aria-hidden="true">📅</span> No reminders yet</p>
            <p>Create your first prayer reminder to get started!</p>
          </div>
        ) : (
          displayedReminders.map((reminder) => (
            <div key={reminder._id} className={`reminder-card ${!reminder.enabled ? 'disabled' : ''}`}>
              <div className="reminder-icon" aria-hidden="true">
                {reminder.prayerType === 'rosary' ? '📿' : 
                 reminder.prayerType === 'morning' ? '🌅' :
                 reminder.prayerType === 'evening' ? '🌙' :
                 reminder.prayerType === 'angelus' ? '🔔' :
                 reminder.prayerType === 'divine-mercy' ? '✝️' : '⏰'}
              </div>
              <div className="reminder-info">
                <h3>{reminder.title}</h3>
                {reminder.description && <p>{reminder.description}</p>}
                <div className="reminder-details">
                  <span className="time"><span aria-hidden="true">🕐</span> {reminder.time}</span>
                  {reminder.days.length > 0 && (
                    <span className="days">
                      <span aria-hidden="true">📅</span> {reminder.days.map(d => d.substring(0, 3)).join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <div className="reminder-actions">
                <button
                  className="btn-icon"
                  onClick={() => updateMutation.mutate({ 
                    id: reminder._id!, 
                    data: { enabled: !reminder.enabled }
                  })}
                  aria-label={reminder.enabled ? `Disable reminder: ${reminder.title}` : `Enable reminder: ${reminder.title}`}
                >
                  <span aria-hidden="true">{reminder.enabled ? '🔔' : '🔕'}</span>
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(reminder)}
                  aria-label={`Edit reminder: ${reminder.title}`}
                >
                  <span aria-hidden="true">✏️</span>
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDelete(reminder._id!)}
                  aria-label={`Delete reminder: ${reminder.title}`}
                >
                  <span aria-hidden="true">🗑️</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
