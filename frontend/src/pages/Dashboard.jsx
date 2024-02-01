import Navbar from '@/components/dashboard-components/Navbar';
import UserBalance from '@/components/dashboard-components/UserBalance';
import UserDetails from '@/components/dashboard-components/UserDetails';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <UserBalance />
      <UserDetails />
    </div>
  );
};

export default Dashboard;
