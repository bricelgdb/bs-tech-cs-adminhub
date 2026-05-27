import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import WorkflowBuilder from './pages/WorkflowBuilder';
import BenchmarkDashboard from './pages/BenchmarkDashboard';
import CostEstimator from './pages/CostEstimator';
import ToolsLibrary from './pages/ToolsLibrary';
import WorkflowHistory from './pages/WorkflowHistory';
import AdminSettings from './pages/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="workflow-builder" element={<WorkflowBuilder />} />
          <Route path="benchmark" element={<BenchmarkDashboard />} />
          <Route path="cost-estimator" element={<CostEstimator />} />
          <Route path="tools" element={<ToolsLibrary />} />
          <Route path="history" element={<WorkflowHistory />} />
          <Route path="admin" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
