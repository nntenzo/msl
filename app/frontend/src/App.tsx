import { useEffect } from "react";

function App() {
  useEffect(() => {
    window.location.href = '/static-site/index.html';
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Redirecting to static site...</p>
    </div>
  );
}

export default App;