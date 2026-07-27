"use client"
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { add } from "@/lib/store/features/cart/cartSlice";
import { useAppDispatch } from "@/lib/store/hooks";

type PropTypes = {
  product : string
}

const HomePage = () => {

  const dispatch = useAppDispatch()

  const handleAddtoCart = (productId : string) =>{
    dispatch(add([productId]))
  }

  return (
    <div>
      <Hero/>

      <div className="text-center">
        <h1>Redux</h1>
        <div >
          <Button onClick={()=> handleAddtoCart("123423")}>Like</Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;