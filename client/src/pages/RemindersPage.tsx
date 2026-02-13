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
    if (confirm('Are you sure you want to delete this reminder?')) {
      deleteMutation.mutate(id);
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
          <h1>⏰ Prayer Reminders</h1>
          <p>Never miss your daily prayers</p>
        </div>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Reminder'}
        </button>
      </div>

      {showForm && (
        <div className="reminder-form-container">
          <form className="reminder-form" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Reminder' : 'New Reminder'}</h3>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Morning Prayer"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional note..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Prayer Type</label>
              <select
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
              <label>Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Repeat on days</label>
              <div className="days-selector">
                {allDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`day-button ${formData.days.includes(day as any) ? 'active' : ''}`}
                    onClick={() => toggleDay(day)}
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

      <div className="reminders-list">
        {displayedReminders.length === 0 ? (
          <div className="empty-state">
            <p>📅 No reminders yet</p>
            <p>Create your first prayer reminder to get started!</p>
          </div>
        ) : (
          displayedReminders.map((reminder) => (
            <div key={reminder._id} className={`reminder-card ${!reminder.enabled ? 'disabled' : ''}`}>
              <div className="reminder-icon">
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
                  <span className="time">🕐 {reminder.time}</span>
                  {reminder.days.length > 0 && (
                    <span className="days">
                      📅 {reminder.days.map(d => d.substring(0, 3)).join(', ')}
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
                  title={reminder.enabled ? 'Disable' : 'Enable'}
                >
                  {reminder.enabled ? '🔔' : '🔕'}
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(reminder)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDelete(reminder._id!)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
