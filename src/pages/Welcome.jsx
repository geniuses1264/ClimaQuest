import { Link } from "react-router-dom"

const Welcome = () => {
  return (
    //import background image and set it as the background of the welcome page 
  <section className=" bg-[url('/src/assets/backgroundimage.png')] bg-cover bg-center h-screen flex flex-col justify-center items-center text-center overflow-y-hidden  ">
    {/* import montserrat font */}
    <h1 className=" font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl xl:text-6xl text-white p-4">Welcome to <span className="text-amber-500 ">ClimaQuest</span></h1>

    <p className=" text-amber-100 md:w-2xl sm:w-3xl xl:w-4xl md:text-2xl p-3"> Your ultimate weather companion, providing accurate and up-to-date weather information at your fingertips. Whether you're planning your day, week, or a special event, ClimaQuest has got you covered with real-time forecasts, severe weather alerts, and interactive maps. Stay informed and prepared with ClimaQuest - your go-to app for all things weather!</p> 
    

    <button className=" bg-amber-500 px-3 py-2 rounded-lg hover:bg-amber-400 font-bold mt-4 md:text-2xl sm:text-sm text-white transition duration-300 hover:shadow-2xl hover:scale-x-105">

      <Link to="/Dashboard "> Explore now</Link>
    </button>
   
  </section>
  )
}

export default Welcome
