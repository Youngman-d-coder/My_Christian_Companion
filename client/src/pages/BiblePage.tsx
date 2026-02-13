import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bibleAPI, userAPI } from '../services/api';
import { useAppStore, useAuthStore } from '../store';
import './BiblePage.css';

export default function BiblePage() {
  const { currentBibleTranslation, setCurrentBibleTranslation } = useAppStore();
  const user = useAuthStore((state) => state.user);
  const [selectedBook, setSelectedBook] = useState('John');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [bookmarkStatus, setBookmarkStatus] = useState<string | null>(null);

  const { data: translations } = useQuery({
    queryKey: ['translations'],
    queryFn: bibleAPI.getTranslations
  });

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: bibleAPI.getBooks
  });

  const { data: chapter, isLoading } = useQuery({
    queryKey: ['chapter', currentBibleTranslation, selectedBook, selectedChapter],
    queryFn: () => bibleAPI.getChapter(currentBibleTranslation, selectedBook, selectedChapter),
    enabled: !!selectedBook && !!selectedChapter
  });

  useEffect(() => {
    if (selectedBook && selectedChapter) {
      userAPI.addToHistory({ book: selectedBook, chapter: selectedChapter }).catch(console.error);
    }
  }, [selectedBook, selectedChapter]);

  const handleBookmarkVerse = async (verse: number, text: string) => {
    try {
      await userAPI.addBookmark({
        book: selectedBook,
        chapter: selectedChapter,
        verse,
        text
      });
      setBookmarkStatus(`${selectedBook} ${selectedChapter}:${verse} bookmarked successfully!`);
      setTimeout(() => setBookmarkStatus(null), 3000);
    } catch (error) {
      console.error('Error bookmarking verse:', error);
      setBookmarkStatus('Failed to bookmark verse. Please try again.');
      setTimeout(() => setBookmarkStatus(null), 3000);
    }
  };

  return (
    <div className="bible-page">
      <div className="bible-header">
        <h1><span aria-hidden="true">📖</span> Holy Bible</h1>
        <div className="bible-controls">
          <label htmlFor="translation-select" className="sr-only">Select Bible Translation</label>
          <select
            id="translation-select"
            value={currentBibleTranslation}
            onChange={(e) => setCurrentBibleTranslation(e.target.value)}
            className="translation-select"
            aria-label="Select Bible translation"
          >
            {translations?.map((trans) => (
              <option key={trans.id} value={trans.id}>
                {trans.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {bookmarkStatus && (
        <div className="bookmark-notification" role="status" aria-live="polite">
          {bookmarkStatus}
        </div>
      )}

      <div className="bible-content">
        <aside className="bible-sidebar" aria-label="Bible book navigation">
          <div className="book-selector">
            <h3>Old Testament</h3>
            <div className="book-list">
              {books?.oldTestament.map((book) => (
                <button
                  key={book}
                  className={selectedBook === book ? 'active' : ''}
                  onClick={() => {
                    setSelectedBook(book);
                    setSelectedChapter(1);
                  }}
                  aria-label={`Read ${book}`}
                  aria-current={selectedBook === book ? true : undefined}
                >
                  {book}
                </button>
              ))}
            </div>

            <h3>New Testament</h3>
            <div className="book-list">
              {books?.newTestament.map((book) => (
                <button
                  key={book}
                  className={selectedBook === book ? 'active' : ''}
                  onClick={() => {
                    setSelectedBook(book);
                    setSelectedChapter(1);
                  }}
                  aria-label={`Read ${book}`}
                  aria-current={selectedBook === book ? true : undefined}
                >
                  {book}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="bible-reader">
          <div className="chapter-navigation">
            <button
              onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
              disabled={selectedChapter <= 1}
              className="nav-button"
              aria-label="Go to previous chapter"
            >
              ← Previous
            </button>
            <div className="chapter-selector">
              <span className="book-name">{selectedBook}</span>
              <label htmlFor="chapter-input" className="sr-only">Chapter number</label>
              <input
                id="chapter-input"
                type="number"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="chapter-input"
                aria-label="Chapter number"
              />
            </div>
            <button
              onClick={() => setSelectedChapter(selectedChapter + 1)}
              className="nav-button"
              aria-label="Go to next chapter"
            >
              Next →
            </button>
          </div>

          {isLoading ? (
            <div className="loading" role="status" aria-live="polite">Loading chapter...</div>
          ) : (
            <div className="verses-container">
              {chapter?.verses.map((verse) => (
                <div key={verse.number} className="verse">
                  <span className="verse-number" aria-label={`Verse ${verse.number}`}>{verse.number}</span>
                  <span className="verse-text">{verse.text}</span>
                  <button
                    className="bookmark-button"
                    onClick={() => handleBookmarkVerse(verse.number, verse.text)}
                    aria-label={`Bookmark verse ${verse.number}`}
                  >
                    <span aria-hidden="true">🔖</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {user?.bookmarks && user.bookmarks.length > 0 && (
            <div className="bookmarks-section">
              <h3>Your Bookmarks</h3>
              <div className="bookmarks-list">
                {user.bookmarks.slice(-5).reverse().map((bookmark) => (
                  <div key={bookmark._id} className="bookmark-item">
                    <strong>
                      {bookmark.book} {bookmark.chapter}:{bookmark.verse}
                    </strong>
                    <p>{bookmark.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
