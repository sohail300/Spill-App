import CarouselComponent from "@/components/CarouselComponent";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <main className="px-4 md:px-24 py-12 pt-32 flex flex-col items-center justify-center">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Spill</h1>

          <h1 className="text-xl md:text-3xl font-bold">
            Get Anonymous Feedbacks
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Where your identity remains a secret.
          </p>
        </section>

        <CarouselComponent />
      </main>
      <Footer />
    </div>
  );
}
