import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { 
  DashboardPage, 
  CrmPage, 
  MarketIntelligencePage, 
  OpportunitiesPage 
} from './pages';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/crm" element={<CrmPage />} />
          <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
