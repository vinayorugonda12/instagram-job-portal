import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import AddJob from "./pages/admin/AddJob";
import ManageJobs from "./pages/admin/ManageJobs";
import EditJob from "./pages/admin/EditJob";
import Analytics from "./pages/admin/Analytics";
import Applications from "./pages/admin/Applications";

import ProtectedRoute from "./components/ProtectedRoute";
import PageTracker from "./components/PageTracker";
import AdminLogin from "./pages/admin/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      {/* Track page views */}
      <PageTracker />

      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route
          path="/"
          element={<Navigate to="/jobs" replace />}
        />

        {/* Public jobs page */}
        <Route
          path="/jobs"
          element={<Jobs />}
        />

        {/* Public job details + Apply Now */}
        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route
  path="/admin"
  element={<AdminLogin />}
/>

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <ManageJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs/new"
          element={
            <ProtectedRoute>
              <AddJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs/edit/:id"
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<AdminLogin />} />

        {/* ==================== FALLBACK ==================== */}

        <Route
          path="*"
          element={<Navigate to="/jobs" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;