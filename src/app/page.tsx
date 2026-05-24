import { HeroImage, FeatureCards } from "@/components/home/HomePageMeals";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br flex flex-col items-center justify-start p-6">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between py-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">
          Plan & Plate
        </h1>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-6xl flex flex-col-reverse sm:flex-row items-center gap-8 sm:gap-16 py-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-orange-700">
            Discover Delicious Meals Every Day
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl">
            Explore hundreds of meals, find inspiration for your next dish, and
            manage your favorites all in one place.
          </p>
          <div className="flex gap-4">
            <a
              href="/recipes"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-orange-700 transition"
            >
              View all meals
            </a>
            <a
              href="/recipes?sort=trending"
              className="px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-orange-50 transition"
            >
              View trending meals
            </a>
          </div>
        </div>
        <HeroImage />
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-6xl py-16">
        <h3 className="text-2xl font-semibold text-primary mb-6">
          About Plan & Plate
        </h3>
        <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
          Plan & Plate is a simple platform to help you explore meals, discover
          new recipes, and manage your favorites. Whether you`re cooking for
          yourself or your family, we provide inspiration for every occasion.
        </p>
      </section>

      <FeatureCards />

      {/* Footer */}
      <footer className="w-full max-w-6xl py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        Created by Milton R.
      </footer>
    </main>
  );
}
