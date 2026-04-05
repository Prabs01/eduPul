function Unauthorized() {
  return (
    <div className="app-page" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <div className="card stack" style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div className="eyebrow" style={{ margin: "0 auto" }}>Access blocked</div>
        <h1 style={{ marginTop: 8 }}>403</h1>
        <p className="page-subtitle">
          You are not allowed to access this page.
        </p>
      </div>
    </div>
  );
}
  
export default Unauthorized;