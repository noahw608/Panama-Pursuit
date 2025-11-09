import './index.css'
import Header from "./components/Header.tsx";
import Body from "./components/Body.tsx";
import Report from "./components/Report";

function App() {

  return (
      <>
          <Header />
          <div className="block md:hidden">
              <Report />
          </div>

          <div className="hidden md:block">
              <Body />
          </div>
      </>
  )
}

export default App
