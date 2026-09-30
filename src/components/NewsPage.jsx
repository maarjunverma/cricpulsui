import React, { useState } from 'react';
import { Newspaper, Clock, User, Share2, Tag, ChevronRight, Bookmark, ArrowRight, Flame, X } from 'lucide-react';

const NEWS_ARTICLES = [
  {
    id: 'news-1',
    category: 'Match Reports',
    tag: 'COUNTY CHAMPIONSHIP',
    title: 'Tom Abell\'s Majestic 284 Puts Somerset in Command on Day 3 at Taunton',
    excerpt: 'Surrey bowlers endured a punishing day in the field as former Somerset captain registered his career-best first-class score, anchoring Somerset to 691/8.',
    content: `In one of the most dominant individual batting displays of the 2026 County Championship season, Tom Abell crafted an epochal 284* off 385 balls against Surrey at Taunton.

Surrey, having posted an imposing 422 in their first innings, appeared well placed until Abell teamed up with the lower-order, including Migael Pretorius who blitzed a quickfire 72. 

The partnership stretched the lead to 269 runs heading into the final day, placing Somerset in prime position to enforce a victory push on an increasingly abrasive surface that offered turn to the spinners late on Day 3.`,
    author: 'Alistair Vance',
    readTime: '4 min read',
    publishedAt: '2 hours ago',
    featured: true,
  },
  {
    id: 'news-2',
    category: 'Team India',
    tag: 'BILATERAL TOUR',
    title: 'Virat Kohli and Rohit Sharma Roll Back the Years with Record Lord\'s Stand',
    excerpt: 'Veteran duo produced masterclass in pacing during second ODI, guiding India out of early trouble and laying bedrock for match-winning total.',
    content: `Under gloomy skies at Lord's, India's seasoned batting pillars proved once again why their experience remains priceless in testing overseas conditions. 

After losing early wickets against England's seam attack led by Jofra Archer, Kohli and Sharma combined for a resilient 140-run partnership. Kohli's wristy placement through midwicket and Sharma's vintage pull shots dismantled the English bowling plans.

With India leading the ODI leg, head coach commended the tactical maturity shown by the senior group.`,
    author: 'Rajiv Sengupta',
    readTime: '3 min read',
    publishedAt: '4 hours ago',
    featured: false,
  },
  {
    id: 'news-3',
    category: 'T20 Leagues',
    tag: 'MLC PLAYOFFS',
    title: 'Washington Freedom Seal Finals Spot Following Dominant Dallas Victory',
    excerpt: 'Steven Smith\'s tactical captaincy and a blistering bowling display from Saurabh Netravalkar powered Freedom past San Francisco Unicorns.',
    content: `Major League Cricket's third season reached fever pitch in Dallas as Washington Freedom stamped their authority on the Challenger match.

Chasing 175, Unicorns faltered in the middle overs against disciplined spin variations before Netravalkar closed out the match with three crucial death wickets. 

Freedom now await the winner of the Eliminator for the championship showdown on Sunday.`,
    author: 'Marcus Brody',
    readTime: '5 min read',
    publishedAt: '6 hours ago',
    featured: false,
  },
  {
    id: 'news-4',
    category: 'Analysis',
    tag: 'BOWLING TACTICS',
    title: 'Deconstructing the Modern Wobble Seam: Why Classic Swing Bowlers are Adapting',
    excerpt: 'Statistical deep-dive into how Duke and Kookaburra ball modifications in 2026 have shifted international fast bowling philosophy.',
    content: `The days of bowlers relying exclusively on traditional outswing in the first ten overs are rapidly transforming. 

With data tracking showing that sideways deviation off the seam yields 34% more lbw and bowled dismissals than conventional aerial swing, pace attacks worldwide are mastering the scrambled-seam wobble delivery. 

Fast bowling experts examine how Jasprit Bumrah, Pat Cummins, and Matt Henry generate unpredictable deviation from benign surfaces.`,
    author: 'Dr. Nathan Croft',
    readTime: '6 min read',
    publishedAt: '12 hours ago',
    featured: false,
  },
  {
    id: 'news-5',
    category: 'Interviews',
    tag: 'EXCLUSIVE',
    title: 'Jofra Archer: "My Body Feels 100% Ready for the Demands of 5-Day Cricket"',
    excerpt: 'In an exclusive sit-down, England speedster opens up about his rehab journey, pace rhythm, and ambition to reclaim the Ashes in Australia.',
    content: `Following impressive spells in the domestic circuit and international white-ball fixtures, Jofra Archer speaks candidly about his physical readiness.

"I have bowled over 100 overs across the last month without an ounce of stiffness," Archer revealed. "My radar is clicking and the speedometer is right where I want it."

England's management is monitoring his workload ahead of the winter series down under.`,
    author: 'Helen Davies',
    readTime: '4 min read',
    publishedAt: '1 day ago',
    featured: false,
  },
  {
    id: 'news-6',
    category: 'T20 Leagues',
    tag: 'LPL 2026',
    title: 'Jaffna Kings Extend Unbeaten Streak with Dramatic Last-Over Thriller in Colombo',
    excerpt: 'Charith Asalanka\'s ice-cool composure with 14 needed off the final 6 deliveries kept Kings at the pinnacle of the LPL table.',
    content: `A raucous crowd at R. Premadasa Stadium was treated to a classic T20 finish as Jaffna Kings overcame Galle Marvels.

Needing two boundaries in the final two balls, Asalanka pierced the backward point boundary before launching the penultimate ball over long-on.

The victory guarantees Kings an early qualification for the qualifiers stage.`,
    author: 'Dinesh Wickramasinghe',
    readTime: '3 min read',
    publishedAt: '1 day ago',
    featured: false,
  }
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [readingArticle, setReadingArticle] = useState(null);

  const categories = ['All', 'Match Reports', 'Team India', 'T20 Leagues', 'Analysis', 'Interviews'];

  const filteredNews = NEWS_ARTICLES.filter(n => {
    if (selectedCategory === 'All') return true;
    return n.category === selectedCategory;
  });

  const featuredStory = NEWS_ARTICLES.find(n => n.featured) || NEWS_ARTICLES[0];

  return (
    <div style={styles.container}>
      {/* ─── Header ─── */}
      <div style={styles.pageHeader}>
        <div style={styles.badgeRow}>
          <span style={styles.newsBadge}>
            <Newspaper size={14} color="#10b981" />
            <span>CRICAI EDITORIAL & NEWS FEED</span>
          </span>
        </div>
        <h1 style={styles.pageTitle}>Latest Cricket News & Match Reports</h1>
        <p style={styles.pageSubtitle}>
          Breaking stories, ball-by-ball match analyses, tactical breakdowns, and exclusive player interviews.
        </p>
      </div>

      {/* ─── Category Filter Pills ─── */}
      <div style={styles.filterRow}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.filterBtn,
              ...(selectedCategory === cat ? styles.filterBtnActive : {})
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── Featured Hero Story (when All selected) ─── */}
      {selectedCategory === 'All' && (
        <div style={styles.heroCard} onClick={() => setReadingArticle(featuredStory)}>
          <div style={styles.heroContent}>
            <div style={styles.heroBadgeRow}>
              <span style={styles.heroTag}>
                <Flame size={13} color="#ef4444" />
                {featuredStory.tag}
              </span>
              <span style={styles.heroTime}>
                <Clock size={13} color="var(--text-muted)" />
                {featuredStory.publishedAt}
              </span>
            </div>

            <h2 style={styles.heroTitle}>{featuredStory.title}</h2>
            <p style={styles.heroExcerpt}>{featuredStory.excerpt}</p>

            <div style={styles.heroFooter}>
              <div style={styles.authorMeta}>
                <div style={styles.authorAvatar}>
                  <User size={14} color="#10b981" />
                </div>
                <span style={styles.authorName}>{featuredStory.author}</span>
                <span style={styles.dotSeparator}>•</span>
                <span style={styles.readTimeText}>{featuredStory.readTime}</span>
              </div>

              <span style={styles.readMoreBtn}>
                <span>Read Full Story</span>
                <ArrowRight size={15} color="var(--emerald)" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── News Grid ─── */}
      <div className="news-grid-responsive" style={styles.newsGrid}>
        {filteredNews.map(item => (
          <div 
            key={item.id} 
            style={styles.newsCard}
            onClick={() => setReadingArticle(item)}
          >
            <div style={styles.cardHeader}>
              <span style={styles.cardTag}>{item.tag}</span>
              <span style={styles.cardTime}>
                <Clock size={12} color="var(--text-muted)" />
                {item.publishedAt}
              </span>
            </div>

            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardExcerpt}>{item.excerpt}</p>

            <div style={styles.cardFooter}>
              <span style={styles.cardAuthor}>{item.author}</span>
              <span style={styles.cardReadMore}>
                <span>{item.readTime}</span>
                <ChevronRight size={14} color="var(--emerald)" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Article Reader Modal ─── */}
      {readingArticle && (
        <div style={styles.modalOverlay} onClick={() => setReadingArticle(null)}>
          <div className="modal-content-responsive" style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTag}>{readingArticle.tag}</span>
              <button 
                style={styles.closeBtn} 
                onClick={() => setReadingArticle(null)}
                aria-label="Close article"
              >
                <X size={20} />
              </button>
            </div>

            <h2 style={styles.modalTitle}>{readingArticle.title}</h2>

            <div style={styles.modalMetaRow}>
              <div style={styles.authorMeta}>
                <div style={styles.authorAvatar}>
                  <User size={14} color="#10b981" />
                </div>
                <span style={styles.authorName}>{readingArticle.author}</span>
                <span style={styles.dotSeparator}>•</span>
                <span style={styles.readTimeText}>{readingArticle.publishedAt}</span>
              </div>
              <span style={styles.modalReadTime}>{readingArticle.readTime}</span>
            </div>

            <div style={styles.modalBody}>
              {readingArticle.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} style={styles.paragraph}>{paragraph}</p>
              ))}
            </div>

            <div style={styles.modalFooter}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Published on CricAi Live Cricket Wire
              </span>
              <button style={styles.shareBtn} onClick={() => alert('Article link copied!')}>
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  pageHeader: {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(13, 27, 42, 0.95) 100%)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  badgeRow: {
    display: 'flex',
    marginBottom: '0.5rem',
  },
  newsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#10b981',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#fff',
    margin: '0 0 0.35rem 0',
    fontFamily: 'var(--font-heading)',
  },
  pageSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    margin: 0,
    lineHeight: '1.5',
    maxWidth: '700px',
  },
  filterRow: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    paddingBottom: '2px',
  },
  filterBtn: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  filterBtnActive: {
    background: 'transparent',
    borderColor: 'var(--emerald)',
    color: 'var(--emerald)',
    fontWeight: '600',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
  },
  heroCard: {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(13, 27, 42, 0.9) 100%)',
    border: '1.5px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    padding: '1.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  heroBadgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    padding: '3px 10px',
    borderRadius: '14px',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
  },
  heroTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  },
  heroTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.35',
    margin: 0,
    fontFamily: 'var(--font-heading)',
  },
  heroExcerpt: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    margin: 0,
  },
  heroFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '0.85rem',
    marginTop: '0.25rem',
  },
  authorMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.82rem',
  },
  authorAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    color: '#fff',
    fontWeight: '600',
  },
  dotSeparator: {
    color: 'var(--text-muted)',
  },
  readTimeText: {
    color: 'var(--text-muted)',
  },
  readMoreBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--emerald)',
  },
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
    gap: '1.1rem',
    width: '100%',
  },
  newsCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTag: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--emerald)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  cardTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.4',
    margin: 0,
  },
  cardExcerpt: {
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    margin: 0,
    flex: 1,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '0.65rem',
    marginTop: '0.25rem',
  },
  cardAuthor: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  },
  cardReadMore: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--emerald)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modalContent: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    maxWidth: '680px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTag: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--emerald)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'color 0.15s ease',
  },
  modalTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.35',
    margin: 0,
    fontFamily: 'var(--font-heading)',
  },
  modalMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
  },
  modalReadTime: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
  },
  paragraph: {
    margin: 0,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '0.85rem',
    marginTop: '0.5rem',
  },
  shareBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
