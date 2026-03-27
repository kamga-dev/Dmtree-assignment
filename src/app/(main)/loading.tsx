export default function Loading() {
  return (
    <div>
      {/* Header skeleton */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <div className="skeleton" style={{ height: 20, width: 160, borderRadius: 6, marginBottom: 6 }} />
          <div className="skeleton" style={{ height: 13, width: 80, borderRadius: 4 }} />
        </div>
        <div className="skeleton" style={{ height: 36, width: 120, borderRadius: 8 }} />
      </div>

      {/* Filter bar skeleton */}
      <div className="skeleton" style={{ height: 40, width: "100%", borderRadius: 8, marginBottom: "1rem" }} />

      {/* Post cards skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass-card" style={{ padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".375rem" }}>
                <div className="skeleton" style={{ height: 28, width: 28, borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 14, width: 22, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 28, width: 28, borderRadius: 6 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 12, width: 70, borderRadius: 4, marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 18, width: `${65 + i * 7}%`, borderRadius: 5, marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 13, width: "100%", borderRadius: 4, marginBottom: 5 }} />
                <div className="skeleton" style={{ height: 13, width: "75%", borderRadius: 4 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}