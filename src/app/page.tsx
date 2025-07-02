import FeatureSection from "@/components/feature-section";
import { Button } from "@/components/ui/button";
import MealsMarquee from "@/components/ui/marquee";

const Home = () => {
  return (
    <div>
      <section className="h-[580px] flex justify-center items-center">
        <div className="mx-auto grid grid-cols-1 text-white sm:px-10 md:px-20 lg:px-40">
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
      <section>
        <MealsMarquee direction="left" />
        <MealsMarquee direction="right" />
      </section>
      <FeatureSection />
      <section>
        <section className="py-20">
          <div className="max-w-7xl mx-auto text-center ">
            <h2 className="text-2xl font-bold mb-8">
              How Plan and Plate Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-2">
                  1. Add Your Ingredients
                </h3>
                <p className="step-desc">
                  Start with what’s in your fridge or pantry.
                </p>
              </div>
              <div className="transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-2">
                  2. Get Recipes Instantly
                </h3>
                <p className="step-desc">
                  We'll suggest meals you can cook right now.
                </p>
              </div>
              <div className="transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-2">
                  3. Plan Your Week
                </h3>
                <p className="step-desc">
                  Drag and drop recipes into your custom meal plan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
      <FeatureSection reverse />
    </div>
  );
};

export default Home;
