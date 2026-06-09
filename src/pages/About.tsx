import React from "react";
import Footer from "@/components/Footer";
import AboutFeature from "@/components/AboutFeature";

const features: string[] = [
  "Convenience to clients and streamlined processing at the click of a button.",
  "Robust and interactive online platform for clients using superior technology.",
  "Services of qualified Panditjis, checked and confirmed for both qualifications and conduct.",
  "A complete Puja samagri kit, in branded boxes and bags.",
  "Absolute transparency in pricing, displayed directly on the website.",
  "Pujas and Panditjis are serious, but E-GURUJI brings celebratory emotion, quick service, and maintains the austerity of the ritual.",
  "All Panditjis undergo soft skills training; they are courteous, communicative, and trained in etiquette for an inclusive and festive atmosphere.",
  "Our Pandits are approachable and communicative.",
  "Panditjis visiting for Pujas are vetted for security.",
  "E-GURUJI encourages online reviews for continuous improvement.",
];

const About: React.FC = () => (
  <div className="bg-gradient-to-tr from-orange-50 to-yellow-100 min-h-screen flex flex-col">
    {/* Hero Section */}
    <section className="w-full bg-white/80 border-b border-orange-100">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center px-3 py-12 gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-700 font-playfair mb-3">
            About E-GURUJI
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Where <span className="text-orange-600 font-semibold">tradition</span> meets <span className="text-orange-500 font-semibold">technology</span>. Experience seamless, authentic online puja services at your fingertips.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="/illustrations/puja-hero.png"
            alt="E-GURUJI puja service"
            width={300}
            height={240}
            className="rounded-xl shadow-md border border-orange-100"
          />
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="max-w-3xl mx-auto px-3 mt-10">
      <div className="bg-white/90 p-8 rounded-2xl shadow-xl border border-orange-100 animate-fadeIn">
        <p className="text-xl text-orange-800 font-semibold mb-4 text-center">
          E-GURUJI is an Online Puja Booking Portal where technology meets tradition. All our Pandits are trained in certified Vedic Pathashalas and are experienced in performing puja professionally.
        </p>
        <h2 className="text-lg font-bold text-gray-600 mb-4">We offer:</h2>
        <ul className="space-y-3 mb-2">
          {features.map((item, i) => (
            <AboutFeature key={i}>{item}</AboutFeature>
          ))}
        </ul>
      </div>
    </section>

    <div className="mt-14" />
    <Footer />
  </div>
);

export default About;
