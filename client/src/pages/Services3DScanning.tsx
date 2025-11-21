import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import GlitchTitle from "@/components/GlitchTitle";
import { Check, Upload } from "lucide-react";

export default function Services3DScanning() {
  const [formData, setFormData] = useState({
    scanning: "",
    intendedUse: "",
    fileFormat: "",
    details: "",
    photo: null as File | null,
    timeline: "",
    budget: "",
    email: "",
    name: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <GlitchTitle as="h1" className="text-5xl md:text-6xl font-black mb-6">3D Scanning & Digital Modelling</GlitchTitle>
          <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">
            We capture real-world walls, textures, and objects using photogrammetry to deliver ready-to-use 3D assets for animation, 3D printing, AR, and design projects.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <GlitchTitle className="text-4xl font-black mb-12">Why Choose Our 3D Scanning?</GlitchTitle>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Authentic textures and forms captured from real street art",
              "Clean, optimized meshes ready for animation or 3D printing",
              "Fast turnaround with budget-friendly pricing tiers",
              "Multiple file formats: OBJ, FBX, GLB with 4K textures",
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <GlitchTitle className="text-4xl font-black mb-12">How It Works</GlitchTitle>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Scan", desc: "We capture your wall, object, or texture using photogrammetry" },
              { step: "2", title: "Clean & Model", desc: "We process and optimize the 3D mesh" },
              { step: "3", title: "Deliver", desc: "You receive high-quality 3D files ready to use" },
            ].map((item, idx) => (
              <div key={idx} className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <GlitchTitle className="text-4xl font-black mb-12">Use Cases</GlitchTitle>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "AR filters",
              "Animation assets",
              "3D printing",
              "Product mockups",
              "Digital dioramas",
              "Mural preservation",
            ].map((useCase, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition">
                <p className="text-lg font-bold text-gray-900">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <GlitchTitle className="text-4xl font-black mb-8 text-center">Request a 3D Scan</GlitchTitle>
          
          {submitted && (
            <div className="mb-6 p-4 bg-green-100 border-2 border-green-600 rounded-lg text-green-800 font-bold">
              ✓ Request submitted! We'll be in touch soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg border-2 border-gray-200">
            <div>
              <label className="block text-sm font-bold mb-2">What are you scanning? *</label>
              <select 
                name="scanning" 
                value={formData.scanning}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="">Select...</option>
                <option value="wall">Wall</option>
                <option value="object">Object</option>
                <option value="texture">Texture</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Intended use *</label>
              <select 
                name="intendedUse" 
                value={formData.intendedUse}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="">Select...</option>
                <option value="animation">Animation</option>
                <option value="3d-printing">3D Printing</option>
                <option value="ar">AR</option>
                <option value="reference">Reference</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Required file format *</label>
              <select 
                name="fileFormat" 
                value={formData.fileFormat}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="">Select...</option>
                <option value="obj">OBJ</option>
                <option value="fbx">FBX</option>
                <option value="glb">GLB</option>
                <option value="unsure">Unsure</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Size and complexity details</label>
              <textarea 
                name="details" 
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Describe the size, complexity, and any special requirements..."
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Upload reference photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-600 transition">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formData.photo ? formData.photo.name : "Click to upload or drag and drop"}
                  </span>
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Timeline *</label>
                <input 
                  type="text" 
                  name="timeline" 
                  value={formData.timeline}
                  onChange={handleInputChange}
                  placeholder="e.g., ASAP, 2 weeks, flexible"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Budget range *</label>
                <input 
                  type="text" 
                  name="budget" 
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g., $500-$1000"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Email *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg">
              Request 3D Scan
            </Button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <GlitchTitle className="text-4xl font-black mb-12 text-center">Frequently Asked Questions</GlitchTitle>
          <div className="space-y-6">
            {[
              { q: "What's the typical turnaround time?", a: "Most scans are completed within 1-2 weeks depending on complexity. Rush orders available." },
              { q: "What file formats do you provide?", a: "We provide OBJ, FBX, and GLB formats with 4K textures included." },
              { q: "Can I use the scans commercially?", a: "Yes, all scans come with full commercial usage rights." },
              { q: "What's your service area?", a: "We operate in Brisbane and surrounding areas. Remote projects available." },
              { q: "What if I need revisions?", a: "We include one round of revisions. Additional revisions available at additional cost." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border-l-4 border-blue-600 p-6 rounded">
                <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-700">{item.a}</p>
              </div>
            ))}
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
                <li><a href="/workshops" className="text-gray-400 hover:text-white transition">Workshops</a></li>
                <li><a href="/shop" className="text-gray-400 hover:text-white transition">Shop</a></li>
                <li><a href="/portfolio" className="text-gray-400 hover:text-white transition">Portfolio</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-lg mb-4 uppercase tracking-widest">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/services" className="text-gray-400 hover:text-white transition">All Services</a></li>
                <li><a href="/services/murals" className="text-gray-400 hover:text-white transition">Mural Service</a></li>
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

