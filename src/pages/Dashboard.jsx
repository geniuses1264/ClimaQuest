import WeatherCard  from "../components/WeatherCard"

const Dashboard = () => {
  return (
    <div>
       <h1>Dashboard</h1>
       <WeatherCard fallbackLocation="New york" destination ="Central Park, New York, Ghana, us" />
    </div>
  )
}

export default Dashboard
