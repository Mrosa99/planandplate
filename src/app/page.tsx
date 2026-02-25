// app/page.tsx
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br  flex flex-col items-center justify-start p-6">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between py-8">
        <h1 className="text-4xl sm:text-5xl font-bold ">Plan & Plate</h1>
        <nav className="mt-4 sm:mt-0 flex gap-6  font-medium">
          <a href="#about" className="hover:underline">
            About
          </a>
          <a href="#meals" className="hover:underline">
            Meals
          </a>
          <a href="#contact" className="hover:underline">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-6xl flex flex-col-reverse sm:flex-row items-center gap-8 sm:gap-16 py-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold ">
            Discover Delicious Meals Every Day
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl">
            Explore hundreds of meals, find inspiration for your next dish, and
            manage your favorites all in one place.
          </p>
          <div className="flex gap-4">
            <a
              href="/api/insert"
              className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-orange-700 transition"
            >
              Fetch Meals
            </a>
            <a
              href="/meals"
              className="px-6 py-3 border border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition"
            >
              Browse Meals
            </a>
          </div>
        </div>
        <div className="flex-1 relative w-full h-64 sm:h-96">
          <Image
            src="/hero-meal.jpg" // replace with your image
            alt="Delicious meal"
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-6xl py-16">
        <h3 className="text-2xl font-semibold text-orange-600 mb-6">
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
          <Image
            src="/icon-search.svg"
            alt="Search meals"
            width={64}
            height={64}
          />
          <h4 className="mt-4 text-xl font-semibold text-orange-700">
            Discover
          </h4>
          <p className="mt-2 text-gray-600">
            Search meals by name, category, or first letter.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <Image
            src="/icon-heart.svg"
            alt="Save meals"
            width={64}
            height={64}
          />
          <h4 className="mt-4 text-xl font-semibold text-orange-700">
            Favorites
          </h4>
          <p className="mt-2 text-gray-600">
            Save your favorite meals and quickly access them anytime.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <Image
            src="/icon-upload.svg"
            alt="Upload meals"
            width={64}
            height={64}
          />
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
