import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hymnsAPI } from '../services/api';
import type { Hymn } from '../types';
import './HymnsPage.css';

export default function HymnsPage() {
  const [selectedCategory, setSelectedCategory] = useState('traditional');
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categoryHymns } = useQuery({
    queryKey: ['hymns', selectedCategory],
    queryFn: () => hymnsAPI.getByCategory(selectedCategory),
    enabled: !searchQuery
  });

  const { data: searchResults } = useQuery({
    queryKey: ['hymns-search', searchQuery],
    queryFn: () => hymnsAPI.search(searchQuery),
    enabled: searchQuery.length > 2
  });

  const { data: featuredHymns } = useQuery({
    queryKey: ['hymns-featured'],
    queryFn: hymnsAPI.getFeatured
  });

  const categories = [
    { id: 'traditional', name: 'Traditional Hymns', icon: '📖' },
    { id: 'catholic', name: 'Catholic Hymns', icon: '✝️' },
    { id: 'protestant', name: 'Protestant Hymns', icon: '✝️' },
    { id: 'orthodox', name: 'Orthodox Hymns', icon: '☦️' },
    { id: 'contemporary', name: 'Contemporary', icon: '🎵' },
    { id: 'spirituals', name: 'Spirituals', icon: '🎶' }
  ];

  const renderHymnCard = (hymn: Hymn) => (
    <div
      key={hymn.id}
      className="hymn-card"
      onClick={() => setSelectedHymn(hymn)}
    >
      <h3>{hymn.title}</h3>
      <p className="hymn-author">by {hymn.author}</p>
      <p className="hymn-year">{hymn.year}</p>
      <p className="hymn-firstline">"{hymn.firstLine}..."</p>
    </div>
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="hymns-page">
      <div className="hymns-header">
        <h1>🎵 Christian Hymns</h1>
        <p>Explore traditional and contemporary Christian hymns from all denominations</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search hymns by title, author, or first line..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {searchQuery.length > 2 && searchResults ? (
        <div className="search-results">
          <h2>Search Results ({searchResults.length})</h2>
          <div className="hymns-grid">
            {searchResults.map((hymn) => renderHymnCard(hymn))}
          </div>
          {searchResults.length === 0 && (
            <p className="no-results">No hymns found. Try a different search term.</p>
          )}
        </div>
      ) : !selectedHymn ? (
        <>
          {featuredHymns && featuredHymns.length > 0 && (
            <section className="featured-section">
              <h2>⭐ Featured Hymns</h2>
              <div className="hymns-grid">
                {featuredHymns.map((hymn) => renderHymnCard(hymn))}
              </div>
            </section>
          )}

          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedHymn(null);
                }}
              >
                <span className="category-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="hymns-content">
            {categoryHymns && Object.entries(categoryHymns).map(([subCategory, hymns]) => {
              const hymnArray = Array.isArray(hymns) ? hymns : [];
              return (
              <div key={subCategory} className="hymn-section">
                <h2>{subCategory.charAt(0).toUpperCase() + subCategory.slice(1)} Hymns</h2>
                <div className="hymns-grid">
                  {hymnArray.map((hymn: Hymn) => renderHymnCard(hymn))}
                </div>
              </div>
            )})}
          </div>
        </>
      ) : (
        <div className="hymn-detail">
          <button className="back-button" onClick={() => setSelectedHymn(null)}>
            ← Back to hymns
          </button>
          
          <div className="hymn-detail-content">
            <div className="hymn-detail-header">
              <h2>{selectedHymn.title}</h2>
              <div className="hymn-meta">
                <p><strong>Author:</strong> {selectedHymn.author}</p>
                <p><strong>Year:</strong> {selectedHymn.year}</p>
                <p><strong>Denomination:</strong> {selectedHymn.denomination}</p>
                <p><strong>Category:</strong> {selectedHymn.category}</p>
              </div>
            </div>

            <div className="hymn-firstline">
              <h3>Opening Line</h3>
              <p className="firstline-text">"{selectedHymn.firstLine}..."</p>
            </div>

            <div className="hymn-description">
              <h3>About This Hymn</h3>
              <p>{selectedHymn.description}</p>
            </div>

            <div className="hymn-links">
              <h3>Resources</h3>
              <div className="links-grid">
                {selectedHymn.youtubeLink && (
                  <a
                    href={selectedHymn.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link youtube-link"
                  >
                    <span className="link-icon">🎥</span>
                    <span className="link-text">
                      <strong>Listen on YouTube</strong>
                      <small>Watch and listen to this hymn</small>
                    </span>
                  </a>
                )}
                {selectedHymn.lyricsLink && (
                  <a
                    href={selectedHymn.lyricsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link lyrics-link"
                  >
                    <span className="link-icon">📄</span>
                    <span className="link-text">
                      <strong>View Full Lyrics</strong>
                      <small>Read the complete text and history</small>
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
