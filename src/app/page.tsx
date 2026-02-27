// app/page.tsx
import Image from "next/image";
import { fetchRandomMeals } from "../lib/supabase/fetch-meals";
import { MealData } from "../lib/supabase/fetch-meals";

export default async function HomePage() {
  // Fetch a random meal on the server
  let MealData: MealData[] = [];
  try {
    MealData = await fetchRandomMeals(4);
  } catch (err) {
    console.error("Error fetching random meal:", err);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br  flex flex-col items-center justify-start p-6">
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
              href="/"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-orange-700 transition"
            >
              Fetch Meals
            </a>
            <a
              href="/"
              className="px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-orange-50 transition"
            >
              Browse Meals
            </a>
          </div>
        </div>
        <div className="flex-1 relative w-full h-64 sm:h-96">
          {MealData ? (
            <Image
              src={MealData[0].image_url}
              alt={MealData[0].name}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              Loading...
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-6xl py-16">
        <h3 className="text-2xl font-semibold text-primary mb-6">
          About Plan & Plate
        </h3>
        <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
          Plan & Plate is a simple platform to help you explore meals, discover
          new recipes, and manage your favorites. Whether you’re cooking for
          yourself or your family, we provide inspiration for every occasion.
        </p>
      </section>

      {/* Features / Highlights */}
      <section
        id="meals"
        className="w-full max-w-6xl py-16 grid grid-cols-1 sm:grid-cols-3 gap-8"
      >
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          {MealData ? (
            <Image
              src={MealData[1].image_url}
              alt={MealData[1].name}
              width={64}
              height={64}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              Loading...
            </div>
          )}
          <h4 className="mt-4 text-xl font-semibold text-orange-700">
            Discover
          </h4>
          <p className="mt-2 text-gray-600">
            Search meals by name, category, or first letter.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          {MealData ? (
            <Image
              src={MealData[2].image_url}
              alt={MealData[2].name}
              width={64}
              height={64}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              Loading...
            </div>
          )}
          <h4 className="mt-4 text-xl font-semibold text-orange-700">
            Favorites
          </h4>
          <p className="mt-2 text-gray-600">
            Save your favorite meals and quickly access them anytime.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          {MealData ? (
            <Image
              src={MealData[3].image_url}
              alt={MealData[3].name}
              width={64}
              height={64}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              Loading...
            </div>
          )}
          <h4 className="mt-4 text-xl font-semibold text-orange-700">
            Add Your Own
          </h4>
          <p className="mt-2 text-gray-600">
            Easily add new meals and contribute to the database.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        &copy; {new Date().getFullYear()} Plan & Plate. All rights reserved.
      </footer>
    </main>
  );
}
