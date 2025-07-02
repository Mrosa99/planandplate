import MediaCard from "./ui/media-card";

interface FeatureSectionProps {
  reverse?: boolean;
}

const FeatureSection = ({ reverse = false }: FeatureSectionProps) => {
  const content = (
    <div className="text-left w-[600px]">
      <div className="border-l-2 border-gray-300 pl-4 mb-8">
        <h2 className="text-xl lg:text-3xl font-bold mb-4">
          Ingredient Based Recipes
        </h2>
        <p>
          Find recipes tailored to the ingredients you already have at home.
        </p>
      </div>
      <div className="pl-4 mb-8">
        <h2 className="text-xl lg:text-3xl font-bold mb-4">
          Smart Meal Planning & Scheduling
        </h2>
        <p>Plan your weekly meals with ease.</p>
      </div>
      <div className="pl-4 mb-8">
        <h2 className="text-xl lg:text-3xl font-bold mb-4">
          Personalized Recipe Recommendations
        </h2>
        <p>Get suggestions based on your preferences.</p>
      </div>
    </div>
  );

  return (
    <section className="w-full h-[580px]">
      <div className="w-full grid grid-cols-2 h-full">
        {reverse ? (
          <>
            <div className="flex items-center justify-center h-full">
              {content}
            </div>
            <div className="flex justify-center items-center h-full">
              <MediaCard />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center items-center h-full">
              <MediaCard />
            </div>
            <div className="flex items-center justify-center h-full">
              {content}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeatureSection;
