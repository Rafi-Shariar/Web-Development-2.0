import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";


const HomePage = () => {
  return (
    <div>
      <Hero/>

      <div className="text-center">
        <h1>Redux</h1>
        <div >
          <Button>Like</Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;