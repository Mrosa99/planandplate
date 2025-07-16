import FeatureSection from "@/components/feature-section";
import Footer from "@/components/footer-section";
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
      <section className="overflow-x-hidden w-full">
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
        <FeatureSection reverse />
      </section>
      <section className="relative h-[440px] flex flex-col justify-end overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-[100px] rotate-180 text-primary"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M0,160L40,149.3C80,139,160,117,240,90.7C320,64,400,32,480,42.7C560,53,640,107,720,144C800,181,880,203,960,186.7C1040,171,1120,117,1200,96C1280,75,1360,85,1400,90.7L1440,96L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />
        </svg>
        <div className="w-full h-[350px] bg-primary overflow-y-auto z-10 relative flex items-center justify-center">
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default Home;
