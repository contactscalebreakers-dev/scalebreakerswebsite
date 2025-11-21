import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import GlitchTitle from "@/components/GlitchTitle";

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <GlitchTitle as="h1" className="text-5xl md:text-6xl font-black mb-6">Services</GlitchTitle>
          <p className="text-lg text-gray-600 max-w-2xl">
            Scale Breakers offers specialized creative services to bring your vision to life. Explore our offerings below.
          </p>
        </div>
      </section>

      {/* Services Cards */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* 3D Scanning Card */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-10 hover:border-blue-600 hover:shadow-2xl transition">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <span className="text-3xl">📐</span>
              </div>
              <GlitchTitle as="h2" className="text-3xl font-black mb-4">3D Scanning & Digital Modelling</GlitchTitle>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Photogrammetry scans of walls, textures, and objects for animation, 3D printing, and AR. Ready-to-use 3D assets.
              </p>
              <Link href="/services/3d-scanning">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Custom Mural Card */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-10 hover:border-pink-600 hover:shadow-2xl transition">
              <div className="bg-pink-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <span className="text-3xl">🎨</span>
              </div>
              <GlitchTitle as="h2" className="text-3xl font-black mb-4">Custom Mural Service</GlitchTitle>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Transform vandalized walls into unique artworks that customers respect. Professional mural design and execution.
              </p>
              <Link href="/services/murals">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white font-bold flex items-center gap-2">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 text-lg">
              Need something custom? <a href="mailto:contact.scalebreakers@gmail.com" className="text-blue-600 font-bold hover:underline">Contact us</a> for custom orders.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="font-black text-lg mb-4 uppercase tracking-widest">Scale Breakers</h4>
              <p className="text-gray-400 text-sm leading-relaxed">Break the mold. Make art. Explore your creative potential with Scale Breakers.</p>
            </div>
            <div>
              <h4 className="font-black text-lg mb-4 uppercase tracking-widest">Explore</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/workshops" className="text-gray-400 hover:text-white transition">Workshops</Link></li>
                <li><Link href="/shop" className="text-gray-400 hover:text-white transition">Shop</Link></li>
                <li><Link href="/portfolio" className="text-gray-400 hover:text-white transition">Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-lg mb-4 uppercase tracking-widest">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services/3d-scanning" className="text-gray-400 hover:text-white transition">3D Scanning</Link></li>
                <li><Link href="/services/murals" className="text-gray-400 hover:text-white transition">Mural Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-lg mb-4 uppercase tracking-widest">Connect</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://instagram.com/scale.breakers" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">Instagram</a></li>
                <li><a href="https://www.facebook.com/TheScaleBreakers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">Facebook</a></li>
                <li><a href="mailto:contact.scalebreakers@gmail.com" className="text-gray-400 hover:text-white transition">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Scale Breakers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

