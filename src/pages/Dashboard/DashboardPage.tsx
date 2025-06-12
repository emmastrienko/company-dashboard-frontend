import UserDashboard from "../../components/dashboard/UserDashboard";

const DashboardPage = () => {

 
  // if (user?.role === "SuperAdmin") {
  //   return <SuperAdminDashboard data={data} />;
  // }

  // if (user?.role === "Admin") {
  //   return <AdminDashboard data={data} />;
  // }

  return <UserDashboard />;
};

export default DashboardPage;
