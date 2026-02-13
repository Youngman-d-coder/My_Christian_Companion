import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { saintsAPI } from '../services/api';
import type { SaintSummary } from '../types';
import './SaintsPage.css';

type TraditionFilter = 'all' | 'catholic' | 'orthodox' | 'both';

export default function SaintsPage() {
  const [selectedTradition, setSelectedTradition] = useState<TraditionFilter>('all');
  const [selectedSaint, setSelectedSaint] = useState<SaintSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: saints, isLoading } = useQuery({
    queryKey: ['saints', selectedTradition],
    queryFn: () => saintsAPI.getAll(selectedTradition === 'all' ? undefined : selectedTradition)
  });

  const { data: saintDetails } = useQuery({
    queryKey: ['saint', selectedSaint?.id],
    queryFn: () => saintsAPI.getById(selectedSaint!.id),
    enabled: !!selectedSaint
  });

  const traditions = [
    { id: 'all' as TraditionFilter, name: 'All Saints', icon: '✝️' },
    { id: 'catholic' as TraditionFilter, name: 'Catholic', icon: '✝️' },
    { id: 'orthodox' as TraditionFilter, name: 'Orthodox', icon: '☦️' },
    { id: 'both' as TraditionFilter, name: 'Both Traditions', icon: '🤝' }
  ];

  const filteredSaints = saints?.filter((saint: SaintSummary) =>
    saint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    saint.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTraditionBadgeColor = (tradition: string) => {
    switch (tradition.toLowerCase()) {
      case 'catholic':
        return '#667eea';
      case 'orthodox':
        return '#f59e0b';
      case 'both':
        return '#10b981';
      default:
        return '#718096';
    }
  };

  return (
    <div className="saints-page">
      <div className="saints-header">
        <h1>✨ Saints Gallery</h1>
        <p>Discover the lives and legacies of holy men and women from Catholic and Orthodox traditions</p>
      </div>

      <div className="saints-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search saints by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="tradition-filters">
          {traditions.map((tradition) => (
            <button
              key={tradition.id}
              className={`tradition-filter ${selectedTradition === tradition.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedTradition(tradition.id);
                setSelectedSaint(null);
              }}
            >
              <span className="filter-icon">{tradition.icon}</span>
              <span>{tradition.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="saints-content">
        {!selectedSaint ? (
          <div className="saints-grid-container">
            {isLoading && (
              <div className="loading-state">
                <div className="loading-spinner">⏳</div>
                <p>Loading saints...</p>
              </div>
            )}

            {!isLoading && filteredSaints && filteredSaints.length === 0 && (
              <div className="empty-state">
                <p className="empty-icon">🔍</p>
                <p>No saints found matching your search.</p>
              </div>
            )}

            {!isLoading && filteredSaints && filteredSaints.length > 0 && (
              <>
                <div className="results-count">
                  <span>{filteredSaints.length} saint{filteredSaints.length !== 1 ? 's' : ''} found</span>
                </div>
                <div className="saints-grid">
                  {filteredSaints.map((saint: SaintSummary) => (
                    <div
                      key={saint.id}
                      className="saint-card"
                      onClick={() => setSelectedSaint(saint)}
                    >
                      <div className="saint-card-header">
                        <div className="saint-image">{saint.image}</div>
                        <span
                          className="tradition-badge"
                          style={{ backgroundColor: getTraditionBadgeColor(saint.tradition) }}
                        >
                          {saint.tradition}
                        </span>
                      </div>
                      <div className="saint-card-body">
                        <h3>{saint.name}</h3>
                        <p className="saint-title">{saint.title}</p>
                        <div className="saint-feast-day">
                          <span className="feast-icon">📅</span>
                          <span>Feast Day: {saint.feastDay}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="saint-detail">
            <button className="back-button" onClick={() => setSelectedSaint(null)}>
              ← Back to saints
            </button>

            {saintDetails && (
              <div className="saint-detail-content">
                <div className="saint-detail-header">
                  <div className="saint-detail-image">{saintDetails.image}</div>
                  <div className="saint-detail-title">
                    <h1>{saintDetails.name}</h1>
                    <p className="saint-detail-subtitle">{saintDetails.title}</p>
                    <div className="saint-meta">
                      <span
                        className="tradition-badge large"
                        style={{ backgroundColor: getTraditionBadgeColor(saintDetails.tradition) }}
                      >
                        {saintDetails.tradition}
                      </span>
                      <span className="feast-day-badge">
                        📅 Feast Day: {saintDetails.feastDay}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="saint-info-grid">
                  <div className="info-card">
                    <div className="info-card-header">
                      <span className="info-icon">📍</span>
                      <h3>Location</h3>
                    </div>
                    <p>{saintDetails.location}</p>
                  </div>

                  <div className="info-card">
                    <div className="info-card-header">
                      <span className="info-icon">🎂</span>
                      <h3>Born</h3>
                    </div>
                    <p>{saintDetails.born}</p>
                  </div>

                  <div className="info-card">
                    <div className="info-card-header">
                      <span className="info-icon">✝️</span>
                      <h3>Died</h3>
                    </div>
                    <p>{saintDetails.died}</p>
                  </div>

                  <div className="info-card">
                    <div className="info-card-header">
                      <span className="info-icon">🛡️</span>
                      <h3>Patronage</h3>
                    </div>
                    <p>{saintDetails.patronage}</p>
                  </div>
                </div>

                <div className="biography-section">
                  <h2>📖 Biography</h2>
                  <div className="biography-content">
                    {saintDetails.biography.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="attributes-section">
                  <h3>Attributes in Art</h3>
                  <p className="attributes-text">{saintDetails.attributes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
