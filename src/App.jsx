import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

import Dashboard from "./pages/admin/Dashboard";
import AddJob from "./pages/admin/AddJob";
import ManageJobs from "./pages/admin/ManageJobs";
import EditJob from "./pages/admin/EditJob";
import Analytics from "./pages/admin/Analytics";

import ProtectedRoute from "./components/ProtectedRoute";
import PageTracker from "./components/PageTracker";
import MyApplications from "./pages/MyApplications";
// import MyApplications from "./pages/MyApplications";
import Applications from "./pages/admin/Applications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      {/* Track page views */}
      <PageTracker />

      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route path="/" element={<Navigate to="/jobs" replace />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* ==================== ADMIN ROUTES ==================== */}

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
  path="/my-applications"
  element={<MyApplications />}
/>
<Route
  path="/admin/applications"
  element={
    <ProtectedRoute>
      <Applications />
    </ProtectedRoute>
  }
/>
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

        {/* ==================== FALLBACK ==================== */}

        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;