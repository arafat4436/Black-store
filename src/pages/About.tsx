import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="py-20 px-4 md:px-8 max-w-4xl mx-auto animate-fade-in leading-relaxed text-neutral-300">
      {/* Title */}
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500 mb-2 font-bold">The Philosophy</p>
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-white mb-6">
          DARK MATTER
        </h1>
        <div className="w-12 h-0.5 bg-white mx-auto" />
      </div>

      {/* Copy block 1 */}
      <section className="mb-20">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mb-6">
          01 // THE ABSENCE OF LIGHT
        </h2>
        <p className="mb-6 font-light text-sm md:text-base leading-relaxed text-neutral-400">
          Dark Matter represents a purge of noise. In a world saturated with visual pollution, neon advertisements, and fleeting trends, we choose the absolute. Black is not simply a color; it is a canvas of silence. It is an exploration of form, shape, shadow, and silhouette without the distraction of hue.
        </p>
        <p className="font-light text-sm md:text-base leading-relaxed text-neutral-400">
          Our clothing is designed to blend seamlessly into urban environments. It exists for those who command a presence through structure, material, and silence, rather than loud logos or bright colors.
        </p>
      </section>

      {/* Visual Quote Banner */}
      <section className="py-16 my-16 border-y border-neutral-900 text-center">
        <blockquote className="text-xl md:text-3xl font-display font-black italic uppercase text-white tracking-wide">
          "BLACK IS NOT SAD. BLACK IS POETIC. <br />
          BLACK IS ALL COLORS COMBINED."
        </blockquote>
      </section>

      {/* Copy block 2 */}
      <section className="mb-20">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mb-6">
          02 // FABRIC AND WEIGHT
        </h2>
        <p className="mb-6 font-light text-sm md:text-base leading-relaxed text-neutral-400">
          Streetwear is felt before it is seen. The drape of a hoodie or the weight of a t-shirt defines its character. We source ultra-heavyweight cotton exclusively:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-brand-charcoal border border-neutral-950">
            <h4 className="text-white font-black uppercase text-sm mb-2">450 GSM BRUSHED COTTON FLEECE</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Used for our Midnight hoodies. Custom-knitted and pre-shrunk, offering an structure that does not deflate, keeping a rigid boxy fit.
            </p>
          </div>
          <div className="p-6 bg-brand-charcoal border border-neutral-950">
            <h4 className="text-white font-black uppercase text-sm mb-2">260 GSM SINGLE JERSEY COTTON</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Used for our Stealth tees. Thick, breathable, and exceptionally soft. Features drop-shoulder patterns that drape cleanly over the shoulders.
            </p>
          </div>
        </div>
      </section>

      {/* Copy block 3 */}
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mb-6">
          03 // URBAN UTILITY
        </h2>
        <p className="font-light text-sm md:text-base leading-relaxed text-neutral-400 mb-6">
          We strip down our patterns to the bare essentials. Drawstrings are removed from hoods to prevent clutter. Pockets are concealed. Embroidery is strictly matte black thread on black canvas. Every cut is engineered to fit relaxed but structured.
        </p>
        <p className="font-light text-sm md:text-base leading-relaxed text-neutral-400">
          Dark Matter is conceived and designed for those who navigate the concrete grids of contemporary cities, demanding comfort, strength, and premium minimalist aesthetics.
        </p>
      </section>
    </div>
  );
};
