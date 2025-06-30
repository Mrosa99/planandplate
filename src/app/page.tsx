import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div>
      <section>
        <div className="mx-auto grid grid-cols-1 text-white py-32 sm:px-10 md:px-20 lg:px-40">
          <h2 className="text-4xl font-bold text-center mb-8">
            Discover Delicious Meals and Plan Meals Easily
          </h2>
          <p className="text-center sm:text-lg lg:text-xl mb-8">
            Plan and Plate helps you discover new recipes, plan your meals, and
            make the most of the ingredients you already have.
          </p>
          <div className=" flex justify-center mt-4 space-x-4">
            <Button className="px-10">Get Started</Button>
            <Button className="px-10 border-3" variant="ghost">
              Top Recipes
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
