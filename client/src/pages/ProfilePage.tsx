import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/api';
import { useAuthStore } from '../store';
import './ProfilePage.css';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState(user?.preferences || {
    theme: 'auto',
    bibleTranslation: 'KJV',
    notificationsEnabled: true
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: userAPI.getProfile
  });

  const updatePrefsMutation = useMutation({
    mutationFn: userAPI.updatePreferences,
    onSuccess: (data) => {
      updateUser(data);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: userAPI.removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const handleSavePreferences = () => {
    updatePrefsMutation.mutate(preferences);
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    if (confirm('Remove this bookmark?')) {
      removeBookmarkMutation.mutate(bookmarkId);
    }
  };

  const displayUser = profile || user;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {displayUser?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1>{displayUser?.name}</h1>
          <p className="profile-email">{displayUser?.email}</p>
          <p className="profile-denom">
            {displayUser?.denomination.charAt(0).toUpperCase() + displayUser?.denomination.slice(1)}
          </p>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2>⚙️ Preferences</h2>
          {!isEditing && (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>

        <div className="preferences-card">
          <div className="pref-item">
            <label>Theme</label>
            {isEditing ? (
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as any })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            ) : (
              <span>{preferences.theme.charAt(0).toUpperCase() + preferences.theme.slice(1)}</span>
            )}
          </div>

          <div className="pref-item">
            <label>Default Bible Translation</label>
            {isEditing ? (
              <select
                value={preferences.bibleTranslation}
                onChange={(e) =>
                  setPreferences({ ...preferences, bibleTranslation: e.target.value })
                }
              >
                <option value="KJV">King James Version (KJV)</option>
                <option value="NIV">New International Version (NIV)</option>
                <option value="ESV">English Standard Version (ESV)</option>
                <option value="NKJV">New King James Version (NKJV)</option>
                <option value="NLT">New Living Translation (NLT)</option>
                <option value="NASB">New American Standard Bible (NASB)</option>
              </select>
            ) : (
              <span>{preferences.bibleTranslation}</span>
            )}
          </div>

          <div className="pref-item">
            <label>Prayer Notifications</label>
            {isEditing ? (
              <input
                type="checkbox"
                checked={preferences.notificationsEnabled}
                onChange={(e) =>
                  setPreferences({ ...preferences, notificationsEnabled: e.target.checked })
                }
              />
            ) : (
              <span>{preferences.notificationsEnabled ? '✅ Enabled' : '❌ Disabled'}</span>
            )}
          </div>

          {isEditing && (
            <div className="pref-actions">
              <button className="btn-save" onClick={handleSavePreferences}>
                Save Changes
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setPreferences(user?.preferences || preferences);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-section">
        <h2>🔖 Bookmarks</h2>
        {displayUser?.bookmarks && displayUser.bookmarks.length > 0 ? (
          <div className="bookmarks-grid">
            {displayUser.bookmarks.map((bookmark) => (
              <div key={bookmark._id} className="bookmark-card">
                <div className="bookmark-header">
                  <strong>
                    {bookmark.book} {bookmark.chapter}:{bookmark.verse}
                  </strong>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveBookmark(bookmark._id!)}
                  >
                    ✕
                  </button>
                </div>
                <p>{bookmark.text}</p>
                <span className="bookmark-date">
                  {new Date(bookmark.createdAt!).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>No bookmarks yet. Start reading the Bible and bookmark your favorite verses!</p>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>📚 Reading History</h2>
        {displayUser?.readingHistory && displayUser.readingHistory.length > 0 ? (
          <div className="history-list">
            {displayUser.readingHistory.slice(-10).reverse().map((entry, index) => (
              <div key={index} className="history-item">
                <span className="history-book">
                  📖 {entry.book} {entry.chapter}
                </span>
                <span className="history-date">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>No reading history yet. Start exploring the Bible!</p>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>ℹ️ About This App</h2>
        <div className="info-card">
          <h3>Christian Companion PWA</h3>
          <p>
            Your spiritual companion for daily devotions, Bible reading, and prayer reminders.
            Works offline and supports multiple Christian denominations.
          </p>
          <div className="app-features">
            <span>✅ Offline Support</span>
            <span>✅ Cloud Sync</span>
            <span>✅ Multi-Denomination</span>
            <span>✅ Bible Reader</span>
            <span>✅ Prayer Library</span>
            <span>✅ Smart Reminders</span>
          </div>
        </div>
      </div>
    </div>
  );
}
