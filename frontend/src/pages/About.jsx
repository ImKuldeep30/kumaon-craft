import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-secondary-800 to-secondary-900 text-white py-20 md:py-28 text-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 z-0 opacity-15">
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-primary-500 blur-2xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-200 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-primary-200 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            Our Story & Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Bridging Himalayan Tradition with Global Markets
          </h1>
          <p className="text-base sm:text-lg text-warm-200 max-w-2xl mx-auto leading-relaxed">
            Discover the rich, ancient history of the Kumaon hills and our commitment to preserving the traditional craftsmanship of local artisans.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 bg-white dark:bg-secondary-800/40 transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-warm-50 transition-theme">
                The Heritage of the Kumaon Region
              </h2>
              <div className="text-secondary-700 dark:text-warm-200 space-y-4 leading-relaxed transition-theme">
                <p>
                  Nestled in the towering heights of the Indian Himalayas, the Kumaon region of Uttarakhand boasts a rich cultural history. Isolated for centuries in pristine valleys, local communities developed unique artistic expressions born from nature, devotion, and daily utility.
                </p>
                <p>
                  From the intricate floral and geometric geometric structures of <strong>Likhai wood carvings</strong> to the vibrant red and white ritual folk patterns of <strong>Aipan floor art</strong>, every piece of Kumaon craft tells a story of survival, celebration, and deeply rooted spirituality.
                </p>
                <p>
                  Similarly, the weavers of Munsyari and Dharchula spin and weave <strong>wool and wild nettle</strong> on family looms, crafting durable blankets and apparel capable of resisting freezing Himalayan winters. In the historic bazaars of Almora, the Tamta guild preserves the metallurgy of hammered <strong>copper craft</strong> dating back to the Chand dynasty.
                </p>
              </div>
            </div>

            {/* Right Side Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-warm-100 dark:border-secondary-750 transition-theme">
                <img
                  src="https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=600&auto=format&fit=crop"
                  alt="Traditional Weaving Loom"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Grid describing the four key crafts */}
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-secondary-800 dark:text-warm-100 transition-theme">Four Pillars of Kumaon Craft</h3>
              <p className="text-xs sm:text-sm text-secondary-700 dark:text-warm-300 transition-theme">
                Our platform stands dedicated to preserving these four traditional Himalayan crafts, bringing financial sustainability to their practitioners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Craft 1 */}
              <div className="bg-warm-50 dark:bg-secondary-800/60 p-6 rounded-2xl border border-warm-200/60 dark:border-secondary-700/50 hover:shadow-lg transition-all duration-300 space-y-4 transition-theme">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-secondary-900 text-primary-600 flex items-center justify-center font-bold text-lg transition-theme">
                  🧶
                </div>
                <h4 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-50 transition-theme">Handloom & Weaving</h4>
                <p className="text-xs text-secondary-700 dark:text-warm-200 leading-relaxed transition-theme">
                  Spun from local Himalayan sheep wool and giant nettle fibers, this craft provides livelihoods to women-run self-help groups.
                </p>
              </div>

              {/* Craft 2 */}
              <div className="bg-warm-50 dark:bg-secondary-800/60 p-6 rounded-2xl border border-warm-200/60 dark:border-secondary-700/50 hover:shadow-lg transition-all duration-300 space-y-4 transition-theme">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-secondary-900 text-primary-600 flex items-center justify-center font-bold text-lg transition-theme">
                  ⚒️
                </div>
                <h4 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-50 transition-theme">Tamta Copperware</h4>
                <p className="text-xs text-secondary-700 dark:text-warm-200 leading-relaxed transition-theme">
                  Hand-hammered water vessels, ritual plates, and kitchenware made by coppersmith families in Almora, renowned for therapeutic benefits.
                </p>
              </div>

              {/* Craft 3 */}
              <div className="bg-warm-50 dark:bg-secondary-800/60 p-6 rounded-2xl border border-warm-200/60 dark:border-secondary-700/50 hover:shadow-lg transition-all duration-300 space-y-4 transition-theme">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-secondary-900 text-primary-600 flex items-center justify-center font-bold text-lg transition-theme">
                  🪶
                </div>
                <h4 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-50 transition-theme">Likhai Woodcraft</h4>
                <p className="text-xs text-secondary-700 dark:text-warm-200 leading-relaxed transition-theme">
                  Traditional wooden architectural carving featuring highly detailed floral, mythical, and geometrical motifs on doors, windows, and lintels.
                </p>
              </div>

              {/* Craft 4 */}
              <div className="bg-warm-50 dark:bg-secondary-800/60 p-6 rounded-2xl border border-warm-200/60 dark:border-secondary-700/50 hover:shadow-lg transition-all duration-300 space-y-4 transition-theme">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-secondary-900 text-primary-600 flex items-center justify-center font-bold text-lg transition-theme">
                  🎨
                </div>
                <h4 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-50 transition-theme">Aipan Folk Art</h4>
                <p className="text-xs text-secondary-700 dark:text-warm-200 leading-relaxed transition-theme">
                  Unique ritual paintwork characterized by white paste motifs painted over a smooth terracotta base, symbolizing holy protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Purpose Section */}
      <section className="bg-warm-100/60 dark:bg-secondary-900/40 py-24 border-t border-b border-warm-200 dark:border-secondary-800 transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-warm-50 transition-theme">Why Kumaon Craft Connect?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl shadow-sm border border-warm-200 dark:border-secondary-700 space-y-3 transition-theme">
                <h4 className="font-bold text-secondary-800 dark:text-warm-100 text-sm transition-theme">Direct Livelihoods</h4>
                <p className="text-xs text-secondary-700 dark:text-warm-300 leading-relaxed transition-theme">
                  Eliminates intermediate middlemen. Up to 85% of wholesale pricing goes directly into the artisans bank account.
                </p>
              </div>

              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl shadow-sm border border-warm-200 dark:border-secondary-700 space-y-3 transition-theme">
                <h4 className="font-bold text-secondary-800 dark:text-warm-100 text-sm transition-theme">Cultural Preservation</h4>
                <p className="text-xs text-secondary-700 dark:text-warm-300 leading-relaxed transition-theme">
                  By building stable commercial value for traditional designs, younger generations of artisans are encouraged to learn the skills.
                </p>
              </div>

              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl shadow-sm border border-warm-200 dark:border-secondary-700 space-y-3 transition-theme">
                <h4 className="font-bold text-secondary-800 dark:text-warm-100 text-sm transition-theme">Ecological Sourcing</h4>
                <p className="text-xs text-secondary-700 dark:text-warm-300 leading-relaxed transition-theme">
                  Every product uses naturally occurring, bio-sourced raw materials from the Himalayan hills, processed using organic methodologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
