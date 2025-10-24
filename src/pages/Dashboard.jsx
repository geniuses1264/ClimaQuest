
import WeatherCard from "../components/WeatherCard";

const Dashboard = () => {
  return (
    <div
      className="relative  bg-[url('/src/assets/Dashboard.jpg')] min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center pt-20"
      
    >
     

        <WeatherCard />
      </div>

  );
};

export default Dashboard;
