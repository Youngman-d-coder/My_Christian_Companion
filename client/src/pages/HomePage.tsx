import { useAuthStore } from '../store';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const user = useAuthStore((state) => state.user);

  const quickActions = [
    { title: 'Read Bible', icon: '📖', link: '/bible', color: '#4299e1' },
    { title: 'Daily Prayers', icon: '🙏', link: '/prayers', color: '#48bb78' },
    { title: 'Hymns', icon: '🎵', link: '/hymns', color: '#ed64a6' },
    { title: 'Set Reminders', icon: '⏰', link: '/reminders', color: '#ed8936' },
    { title: 'My Profile', icon: '👤', link: '/profile', color: '#9f7aea' }
  ];

  const denominationInfo = {
    catholic: {
      dailyPrayers: ['Morning Offering', 'Angelus', 'Divine Mercy Chaplet', 'Rosary'],
      practices: 'Daily Mass, Rosary, Novenas'
    },
    protestant: {
      dailyPrayers: ["Lord's Prayer", 'Morning Prayer', 'Evening Prayer'],
      practices: 'Bible Study, Prayer Groups, Worship'
    },
    orthodox: {
      dailyPrayers: ['Trisagion Prayers', 'Jesus Prayer', 'Morning Prayers'],
      practices: 'Divine Liturgy, Icons, Fasting'
    },
    anglican: {
      dailyPrayers: ['Morning Prayer', 'Evening Prayer', 'Compline'],
      practices: 'Book of Common Prayer, Eucharist'
    },
    other: {
      dailyPrayers: ['Common Christian Prayers'],
      practices: 'Personal devotions and study'
    }
  };

  const userDenom = user?.denomination || 'other';
  const denomInfo = denominationInfo[userDenom as keyof typeof denominationInfo];

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">Welcome, {user?.name}! ✝</h1>
        <p className="hero-subtitle">
          Your spiritual companion for daily devotions, Bible reading, and prayer
        </p>
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action) => (
            <Link
              key={action.link}
              to={action.link}
              className="action-card"
              style={{ borderTopColor: action.color }}
            >
              <div className="action-icon" style={{ background: action.color }}>
                {action.icon}
              </div>
              <h3>{action.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="denomination-section">
        <h2>Your Faith Tradition: {userDenom.charAt(0).toUpperCase() + userDenom.slice(1)}</h2>
        <div className="denom-card">
          <div className="denom-info">
            <h3>Recommended Daily Prayers</h3>
            <ul>
              {denomInfo.dailyPrayers.map((prayer, index) => (
                <li key={index}>{prayer}</li>
              ))}
            </ul>
          </div>
          <div className="denom-info">
            <h3>Common Practices</h3>
            <p>{denomInfo.practices}</p>
          </div>
        </div>
      </section>

      <section className="verse-of-day">
        <h2>Verse of the Day</h2>
        <div className="verse-card">
          <p className="verse-text">
            "For God so loved the world that he gave his one and only Son, that whoever believes in
            him shall not perish but have eternal life."
          </p>
          <p className="verse-reference">— John 3:16 (NIV)</p>
        </div>
      </section>

      <section className="features-overview">
        <h2>App Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>📖 Complete Bible</h3>
            <p>Access all Bible translations with offline support</p>
          </div>
          <div className="feature-item">
            <h3>🙏 Prayer Library</h3>
            <p>Comprehensive prayers for all Christian denominations</p>
          </div>
          <div className="feature-item">
            <h3>🎵 Christian Hymns</h3>
            <p>Traditional and contemporary hymns with links to performances</p>
          </div>
          <div className="feature-item">
            <h3>⏰ Smart Reminders</h3>
            <p>Never miss your daily prayers and devotions</p>
          </div>
          <div className="feature-item">
            <h3>☁️ Cloud Sync</h3>
            <p>Your bookmarks and progress synced across devices</p>
          </div>
          <div className="feature-item">
            <h3>📱 Works Offline</h3>
            <p>Full functionality even without internet</p>
          </div>
          <div className="feature-item">
            <h3>✝️ Multi-Denomination</h3>
            <p>Support for Catholic, Protestant, Orthodox, and more</p>
          </div>
        </div>
      </section>
    </div>
  );
}
