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
      alert('Verse bookmarked successfully!');
    } catch (error) {
      console.error('Error bookmarking verse:', error);
    }
  };

  return (
    <div className="bible-page">
      <div className="bible-header">
        <h1>📖 Holy Bible</h1>
        <div className="bible-controls">
          <select
            value={currentBibleTranslation}
            onChange={(e) => setCurrentBibleTranslation(e.target.value)}
            className="translation-select"
          >
            {translations?.map((trans) => (
              <option key={trans.id} value={trans.id}>
                {trans.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bible-content">
        <aside className="bible-sidebar">
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
            >
              ← Previous
            </button>
            <div className="chapter-selector">
              <span className="book-name">{selectedBook}</span>
              <input
                type="number"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="chapter-input"
              />
            </div>
            <button
              onClick={() => setSelectedChapter(selectedChapter + 1)}
              className="nav-button"
            >
              Next →
            </button>
          </div>

          {isLoading ? (
            <div className="loading">Loading chapter...</div>
          ) : (
            <div className="verses-container">
              {chapter?.verses.map((verse) => (
                <div key={verse.number} className="verse">
                  <span className="verse-number">{verse.number}</span>
                  <span className="verse-text">{verse.text}</span>
                  <button
                    className="bookmark-button"
                    onClick={() => handleBookmarkVerse(verse.number, verse.text)}
                    title="Bookmark this verse"
                  >
                    🔖
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
