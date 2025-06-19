import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import Layout from "./components/layout/Layout";
import CreateCompanyForm from "./components/dashboard/company/CreateCompanyForm";
import "leaflet/dist/leaflet.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddLogo from "./components/dashboard/company/AddLogo";
import EditCompanyForm from "./components/dashboard/company/EditCompanyForm";
import ProfilePage from "./pages/Profile/ProfilePage";
import CompanyDetail from "./components/dashboard/company/CompanyDetail";
import AllCompanies from "./components/dashboard/company/AllCompanies";
import AdminListPage from "./pages/AdminsList/AdminListPage";
import { UserHistoryPage } from "./pages/ActionHistory/UserHistoryPage";
import { AdminHistoryPage } from "./pages/ActionHistory/AdminHistoryPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <DashboardPage />
              </Layout>
            }
          />
          <Route
            path="/companies/create"
            element={
              <Layout>
                <CreateCompanyForm />
              </Layout>
            }
          />
          <Route
            path="/companies/:id"
            element={
              <Layout>
                <CompanyDetail />
              </Layout>
            }
          />
          <Route
            path="/companies/:id/add-logo"
            element={
              <Layout>
                <AddLogo />
              </Layout>
            }
          />
          <Route
            path="/companies/edit/:id"
            element={
              <Layout>
                <EditCompanyForm />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            }
          />
          <Route
            path="/history"
            element={
              <Layout>
                <UserHistoryPage />
              </Layout>
            }
          />
        </Route>

        <Route element={<PrivateRoute roles={["Admin", "SuperAdmin"]} />}>
          <Route
            path="/companies"
            element={
              <Layout>
                <AllCompanies />
              </Layout>
            }
          />
          <Route
            path="/history/all"
            element={
              <Layout>
                <AdminHistoryPage />
              </Layout>
            }
          />
        </Route>

        <Route element={<PrivateRoute roles={["SuperAdmin"]} />}>
          <Route
            path="/admins"
            element={
              <Layout>
                <AdminListPage />
              </Layout>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
