import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { prayersAPI } from '../services/api';
import { useAuthStore } from '../store';
import './PrayersPage.css';

type DenominationType = 'catholic' | 'protestant' | 'orthodox' | 'common';

export default function PrayersPage() {
  const user = useAuthStore((state) => state.user);
  const [selectedDenomination, setSelectedDenomination] = useState<DenominationType>(
    (user?.denomination === 'catholic' || user?.denomination === 'protestant' || user?.denomination === 'orthodox') 
      ? user.denomination 
      : 'catholic'
  );
  const [selectedPrayer, setSelectedPrayer] = useState<any>(null);

  const { data: allPrayers } = useQuery({
    queryKey: ['prayers'],
    queryFn: prayersAPI.getAll
  });

  const { data: denomPrayers } = useQuery({
    queryKey: ['prayers', selectedDenomination],
    queryFn: () => prayersAPI.getByDenomination(selectedDenomination)
  });

  const denominations: { id: DenominationType; name: string; icon: string }[] = [
    { id: 'catholic', name: 'Catholic', icon: '✝️' },
    { id: 'protestant', name: 'Protestant', icon: '✝️' },
    { id: 'orthodox', name: 'Orthodox', icon: '☦️' },
    { id: 'common', name: 'Common Prayers', icon: '🙏' }
  ];

  const renderPrayerCard = (prayer: any) => (
    <button
      key={prayer.id}
      className="prayer-card"
      onClick={() => setSelectedPrayer(prayer)}
      aria-label={`Read prayer: ${prayer.title}`}
    >
      <h3>{prayer.title}</h3>
      {prayer.reference && <p className="prayer-reference">{prayer.reference}</p>}
    </button>
  );

  return (
    <div className="prayers-page">
      <div className="prayers-header">
        <h1><span aria-hidden="true">🙏</span> Prayer Library</h1>
        <p>Explore prayers from various Christian traditions</p>
      </div>

      <div className="denomination-tabs" role="tablist" aria-label="Prayer denominations">
        {denominations.map((denom) => (
          <button
            key={denom.id}
            className={`denom-tab ${selectedDenomination === denom.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedDenomination(denom.id);
              setSelectedPrayer(null);
            }}
            role="tab"
            aria-selected={selectedDenomination === denom.id}
            aria-controls={`${denom.id}-prayers-panel`}
          >
            <span className="denom-icon" aria-hidden="true">{denom.icon}</span>
            <span>{denom.name}</span>
          </button>
        ))}
      </div>

      <div className="prayers-content" role="tabpanel" id={`${selectedDenomination}-prayers-panel`}>
        {!selectedPrayer ? (
          <div className="prayers-grid">
            {selectedDenomination === 'catholic' && denomPrayers?.daily && (
              <div className="prayer-section">
                <h2>Daily Catholic Prayers</h2>
                <div className="prayer-cards">
                  {denomPrayers.daily.map((prayer: any) => renderPrayerCard(prayer))}
                </div>

                {denomPrayers.saints && (
                  <>
                    <h2>Prayers to Saints</h2>
                    <div className="prayer-cards">
                      {denomPrayers.saints.map((prayer: any) => renderPrayerCard(prayer))}
                    </div>
                  </>
                )}

                {denomPrayers.litanies && (
                  <>
                    <h2>Litanies</h2>
                    <div className="prayer-cards">
                      {denomPrayers.litanies.map((prayer: any) => renderPrayerCard(prayer))}
                    </div>
                  </>
                )}

                {denomPrayers.devotional && (
                  <>
                    <h2>Devotional Prayers</h2>
                    <div className="prayer-cards">
                      {denomPrayers.devotional.map((prayer: any) => renderPrayerCard(prayer))}
                    </div>
                  </>
                )}

                {denomPrayers.rosary && (
                  <>
                    <h2>The Holy Rosary</h2>
                    <div className="rosary-section">
                      <button 
                        className="rosary-card" 
                        onClick={() => setSelectedPrayer({ id: 'rosary-guide', title: 'How to Pray the Rosary', instructions: 'Full rosary guide' })}
                        aria-label="Learn how to pray the Rosary"
                      >
                        <h3><span aria-hidden="true">📿</span> Complete Rosary Guide</h3>
                        <p>Learn how to pray the Rosary with all mysteries</p>
                      </button>
                      
                      <div className="mysteries">
                        <h3>Mysteries of the Rosary</h3>
                        <div className="mystery-grid">
                          {Object.entries(denomPrayers.rosary.mysteries).map(([type, mysteries]: [string, any]) => (
                            <div key={type} className="mystery-card">
                              <h4>{type.charAt(0).toUpperCase() + type.slice(1)} Mysteries</h4>
                              <ul>
                                {mysteries.map((mystery: string, idx: number) => (
                                  <li key={idx}>{mystery}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rosary-prayers">
                        <h3>Rosary Prayers</h3>
                        <div className="prayer-cards">
                          {Object.entries(denomPrayers.rosary.prayers).map(([key, text]: [string, any]) => (
                            <button 
                              key={key} 
                              className="prayer-card" 
                              onClick={() => setSelectedPrayer({ id: key, title: key.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), text })}
                              aria-label={`Read prayer: ${key.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`}
                            >
                              <h3>{key.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h3>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedDenomination === 'protestant' && denomPrayers?.daily && (
              <div className="prayer-section">
                <h2>Protestant Prayers</h2>
                <div className="prayer-cards">
                  {denomPrayers.daily.map((prayer: any) => renderPrayerCard(prayer))}
                </div>
              </div>
            )}

            {selectedDenomination === 'orthodox' && denomPrayers?.daily && (
              <div className="prayer-section">
                <h2>Orthodox Prayers</h2>
                <div className="prayer-cards">
                  {denomPrayers.daily.map((prayer: any) => renderPrayerCard(prayer))}
                </div>
              </div>
            )}

            {selectedDenomination === 'common' && allPrayers?.common && (
              <div className="prayer-section">
                <h2>Common Christian Prayers</h2>
                <div className="prayer-cards">
                  {allPrayers.common.map((prayer: any) => renderPrayerCard(prayer))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="prayer-detail">
            <button className="back-button" onClick={() => setSelectedPrayer(null)} aria-label="Go back to prayer list">
              ← Back to prayers
            </button>
            <h2>{selectedPrayer.title}</h2>
            {selectedPrayer.text && (
              <div className="prayer-text">{selectedPrayer.text}</div>
            )}
            {selectedPrayer.instructions && (
              <div className="prayer-instructions">
                <pre>{selectedPrayer.instructions}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
