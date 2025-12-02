export default function Home() {
  return (
    <main>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Science Video Database</h1>
        <p>Curated search experience for technical science enthusiasts</p>
        
        <section style={{ marginTop: '2rem' }}>
          <h2>Browse by Discipline</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {['biology', 'chemistry', 'cs', 'mathematics', 'physics'].map((discipline) => (
              <a
                key={discipline}
                href={`/discipline/${discipline}`}
                style={{
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}
              >
                {discipline}
              </a>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2>Search</h2>
          <form style={{ marginTop: '1rem' }}>
            <input
              type="search"
              placeholder="Search videos, transcripts..."
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            />
          </form>
        </section>
      </div>
    </main>
  )
}

