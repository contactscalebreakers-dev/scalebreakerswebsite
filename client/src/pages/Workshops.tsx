import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Users, Loader, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import GlitchTitle from "@/components/GlitchTitle";

// Workshop images mapping - hand-drawn illustrations
const workshopImages: Record<string, string> = {
  "urban-wind-chimes": "/FE478E37-18F8-41BE-9260-9EB17A326DDA.png",
  "street-diorama": "/C58E566F-D26E-460C-8886-9CB7F3EE2B44.png",
  "street-tote-custom": "/26F96CF3-1CF6-4F16-B6BB-809A8BC2354D.png",
  "mini-letterbox": "/43B9FAA0-5D27-4AED-8C74-6C085C7B9415.png",
  "board-restoration": "/3C8463B9-619D-42F8-99BA-E41927194E7C.png",
  "custom-tumbler-lab": "/37E782DA-13FD-490C-8E0F-AEB263409F41.png",
};

const workshopDetails = {
  "urban-wind-chimes": {
    title: "Urban Wind Chimes",
    price: 20,
    duration: "2 hours",
    capacity: "8-12 people",
    description: "Create stunning wind chimes using reclaimed urban materials and sustainable practices.",
    fullDescription: "Transform discarded materials into beautiful, functional art. Learn to work with reclaimed wood, metal scraps, and found objects to create unique wind chimes that celebrate urban aesthetics. Perfect for those interested in upcycling and sustainable art practices.",
    whatYouCreate: "A fully functional wind chime using reclaimed materials, complete with custom design and tuning.",
    materials: "Reclaimed wood, metal scraps, fishing line, bells, paint markers",
    skills: "Basic woodworking, design principles, upcycling techniques",
    ageGroup: "Ages 14+",
  },
  "street-diorama": {
    title: "Street Diorama",
    price: 20,
    duration: "2.5 hours",
    capacity: "8-12 people",
    description: "Build a miniature urban street scene with 3D models and street art details.",
    fullDescription: "Create a detailed miniature street scene inspired by urban culture. Design your own street layout, add 3D character models, paint street art details, and bring your urban vision to life. Perfect for those who love city culture and detailed craftsmanship.",
    whatYouCreate: "A complete diorama featuring custom street layout, 3D models, and hand-painted street art elements.",
    materials: "Foam base, paint, markers, 3D printed elements, craft supplies",
    skills: "Painting, sculpting basics, spatial design, street art techniques",
    ageGroup: "Ages 12+",
  },
  "street-tote-custom": {
    title: "Street Tote Custom",
    price: 20,
    duration: "1.5 hours",
    capacity: "10-15 people",
    description: "Design and customize your own street-inspired tote bag with vinyl and paint markers.",
    fullDescription: "Express your street style by customizing a premium tote bag. Use vinyl decals, paint markers, and stencils to create a one-of-a-kind bag that reflects your personal brand. Learn professional customization techniques used by street artists.",
    whatYouCreate: "A custom-designed, fully personalized tote bag ready to use.",
    materials: "Premium canvas tote, vinyl decals, paint markers, stencils, heat press",
    skills: "Design composition, vinyl application, hand lettering, color theory",
    ageGroup: "Ages 10+",
  },
  "mini-letterbox": {
    title: "Mini Letterbox",
    price: 20,
    duration: "2 hours",
    capacity: "8-12 people",
    description: "Craft a functional mini letterbox with custom street art design and personalization.",
    fullDescription: "Build a beautiful mini letterbox that doubles as street art. Design custom graphics, apply vinyl, paint details, and create a piece that's both functional and decorative. Perfect for desk storage or as a unique gift.",
    whatYouCreate: "A fully functional mini letterbox with custom design, ready for display or use.",
    materials: "Wood box, paint, vinyl, hardware, decorative elements",
    skills: "Painting, design application, basic assembly, decorative techniques",
    ageGroup: "Ages 12+",
  },
  "board-restoration": {
    title: "Board Restoration",
    price: 20,
    duration: "2.5 hours",
    capacity: "8-12 people",
    description: "Restore and customize a skateboard or wooden board with professional techniques.",
    fullDescription: "Learn professional board restoration and customization. Sand, repair, and completely transform a wooden board with custom graphics, street art designs, and protective finishes. Perfect for skate culture enthusiasts and those interested in board art.",
    whatYouCreate: "A fully restored and customized skateboard or wooden board with professional finish.",
    materials: "Wooden board, sandpaper, paint, varnish, graphics, protective coating",
    skills: "Sanding and prep, painting techniques, graphic application, finishing",
    ageGroup: "Ages 14+",
  },
  "custom-tumbler-lab": {
    title: "Custom Tumbler Lab",
    price: 20,
    duration: "1.5 hours",
    capacity: "10-15 people",
    description: "Design and create custom personalized tumblers with vinyl and paint techniques.",
    fullDescription: "Create a custom tumbler perfect for daily use or as a gift. Learn vinyl application, paint marker techniques, and heat transfer methods. Design something that reflects your personal style and brand.",
    whatYouCreate: "A fully customized, food-safe tumbler with your unique design.",
    materials: "Stainless steel or plastic tumbler, vinyl decals, paint markers, heat press",
    skills: "Vinyl application, heat transfer, design composition, color selection",
    ageGroup: "Ages 10+",
  },
};

export default function Workshops() {
  const { data: workshops, isLoading } = trpc.workshops.list.useQuery();
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);
  const [expandedWorkshop, setExpandedWorkshop] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    quantity: "1",
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting ticket:", ticketForm);
    setTicketForm({ name: "", email: "", quantity: "1" });
    setSelectedWorkshop(null);
  };

  const getWorkshopDetails = (workshopId: string) => {
    const key = Object.keys(workshopDetails).find(
      (k) => workshopDetails[k as keyof typeof workshopDetails].title.toLowerCase().replace(/\s+/g, "-") === workshopId.toLowerCase().replace(/\s+/g, "-")
    );
    return key ? workshopDetails[key as keyof typeof workshopDetails] : null;
  };

  const getWorkshopImage = (workshopTitle: string) => {
    const key = Object.keys(workshopDetails).find(
      (k) => workshopDetails[k as keyof typeof workshopDetails].title === workshopTitle
    );
    return key ? workshopImages[key] : "/portfolio-hithere.jpg";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <GlitchTitle className="text-4xl md:text-5xl font-bold mb-4">Creative Workshops</GlitchTitle>
          <p className="text-lg text-gray-600 max-w-2xl">
            Join our fortnightly creative workshops and learn from experienced artists. Each workshop is designed to help you express your street style and create functional art.
          </p>
        </div>
      </section>

      {/* Workshop Series Info */}
      <section className="bg-blue-50 py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">📅 Schedule</h3>
              <p className="text-gray-600">Fortnightly sessions on weekends. Check back for upcoming dates!</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">💰 Pricing</h3>
              <p className="text-gray-600">$20 per person ($30 pair). Discounts available for group bookings!</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">📍 Location</h3>
              <p className="text-gray-600">Brisbane & surrounds. Contact us for venue details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : workshops && workshops.length > 0 ? (
            <div className="space-y-8">
              {workshops.map((workshop) => {
                const details = getWorkshopDetails(workshop.title);
                const isExpanded = expandedWorkshop === workshop.id;
                const workshopImage = getWorkshopImage(workshop.title);

                return (
                  <div
                    key={workshop.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    {/* Workshop Image */}
                    <div className="w-full h-64 md:h-80 overflow-hidden bg-gray-100">
                      <img
                        src={workshopImage}
                        alt={`Hand-drawn illustration of ${workshop.title}`}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Workshop Content */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{workshop.title}</h3>
                          <p className="text-gray-600 mb-4">{workshop.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-black mb-2">
                            ${workshop.price}
                          </div>
                          <div className="text-sm text-gray-600">per person</div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="grid md:grid-cols-4 gap-4 mb-6 py-4 border-t border-b border-gray-100">
                        {details?.duration && (
                          <div className="text-sm">
                            <span className="font-semibold">Duration:</span> {details.duration}
                          </div>
                        )}
                        {details?.capacity && (
                          <div className="text-sm">
                            <span className="font-semibold">Capacity:</span> {details.capacity}
                          </div>
                        )}
                        {details?.ageGroup && (
                          <div className="text-sm">
                            <span className="font-semibold">Age:</span> {details.ageGroup}
                          </div>
                        )}
                        {workshop.date && (
                          <div className="text-sm">
                            <span className="font-semibold">Next:</span>{" "}
                            {new Date(workshop.date).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() =>
                          setExpandedWorkshop(isExpanded ? null : workshop.id)
                        }
                        className="flex items-center gap-2 text-black font-semibold hover:text-gray-600 transition mb-4"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-5 h-5" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-5 h-5" />
                            Show Details
                          </>
                        )}
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && details && (
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <div>
                            <h4 className="font-bold text-lg mb-2">About This Workshop</h4>
                            <p className="text-gray-600">{details.fullDescription}</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-bold mb-2">✨ What You'll Create</h4>
                              <p className="text-gray-600">{details.whatYouCreate}</p>
                            </div>
                            <div>
                              <h4 className="font-bold mb-2">🎨 Materials Provided</h4>
                              <p className="text-gray-600">{details.materials}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold mb-2">🎓 Skills You'll Learn</h4>
                            <p className="text-gray-600">{details.skills}</p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6">
                        <Button
                          className="flex-1"
                          onClick={() => setSelectedWorkshop(workshop.id)}
                        >
                          Get Tickets
                        </Button>
                        {workshop.qrCode && (
                          <a
                            href={workshop.qrCode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button variant="outline" className="w-full">
                              QR Code
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No workshops scheduled yet.</p>
              <p className="text-gray-500 mb-6">Check back soon for upcoming workshops!</p>
              <p className="text-gray-600">
                Want to be notified when workshops are available?{" "}
                <Link href="/" className="text-black font-semibold hover:underline">
                  Sign up for updates
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3D Integration Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">3D Scanning & Digital Modelling</h2>
          <p className="text-gray-300 mb-8 max-w-2xl">
            We also integrate 3D scanning and digital modelling into our creative process — capturing walls, textures, and characters for animation, 3D printing, or augmented-reality art projects.
          </p>

          {/* 3D Videos */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg overflow-hidden bg-black">
              <video
                src="/23_9_2025-2.mp4"
                autoPlay
                loop
                muted
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden bg-black">
              <video
                src="/esrgan_1754305784.mp4"
                autoPlay
                loop
                muted
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden bg-black">
              <video
                src="/29_9_2025.mp4"
                autoPlay
                loop
                muted
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Explore how we use cutting-edge 3D technology to enhance your creative projects and bring digital visions to life.
          </p>
        </div>
      </section>

      {/* Workshop Packages Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Workshop Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-2">🎨 Street Style Starter</h3>
              <p className="text-gray-600 mb-4">
                Perfect for beginners! Combine 3 workshops and save $10.
              </p>
              <p className="text-2xl font-bold text-black">$50</p>
              <p className="text-sm text-gray-500 mb-4">3 Workshops</p>
              <Button className="w-full">Learn More</Button>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-2">🏗️ Builder's Journey</h3>
              <p className="text-gray-600 mb-4">
                For the serious maker! Master 3 advanced workshops and save $10.
              </p>
              <p className="text-2xl font-bold text-black">$50</p>
              <p className="text-sm text-gray-500 mb-4">3 Advanced Workshops</p>
              <Button className="w-full">Learn More</Button>
            </div>

            <div className="bg-black text-white p-6 rounded-lg border border-black">
              <h3 className="text-xl font-bold mb-2">👑 Complete Urban Creator</h3>
              <p className="text-gray-200 mb-4">
                The ultimate experience! All 6 workshops and save $30.
              </p>
              <p className="text-2xl font-bold">$90</p>
              <p className="text-sm text-gray-300 mb-4">All 6 Workshops</p>
              <Button variant="outline" className="w-full text-black bg-white hover:bg-gray-100">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Access Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">♿ Support Access</h2>
            <p className="text-center text-gray-600 mb-8">Special Needs, NDIS & Local Council Procurement</p>

            <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Scale Breakers offers inclusive, creative skill-building for young people and adults, including participants with disabilities and diverse support needs. Sessions are adaptable, paced gently, and delivered with patience and clear structure.
              </p>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-3">✨ What We Provide</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 1:1 or small-group creative workshops (graffiti lettering, 3D design, diorama, upcycling, maker skills)</li>
                    <li>• Calm, step-by-step instruction with visual prompts, demos and breaks</li>
                    <li>• Sensory-aware setups (earplugs, soft lighting, minimal noise)</li>
                    <li>• Goal-based planning (confidence, fine-motor, communication, routine)</li>
                    <li>• Progress notes & attendance available on request</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">🏥 NDIS (Australia)</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Works with Self-Managed and Plan-Managed participants</li>
                    <li>• Invoices include hours, outcomes, ABN details</li>
                    <li>• Aligns with Capacity Building & Social/Community Participation goals</li>
                    <li>• Coordination with support coordinators or plan managers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">🏛️ Local Councils & Community Programs</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Procurement-ready: ABN, public liability insurance, WWCC/Police Check</li>
                    <li>• Quotes, PO numbers, risk assessments and compliance documentation available</li>
                    <li>• Delivery: one-off activations, school holiday programs, term blocks, murals, and community art</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Scale Breakers is an independent creative support provider (not NDIS-registered). Services available to self-managed and plan-managed participants.
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Ready to discuss your needs?</p>
                <Button className="bg-blue-600 hover:bg-blue-700">Get in Touch</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Modal */}
      {selectedWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold mb-6">Purchase Tickets</h2>
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={ticketForm.name}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={ticketForm.email}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <select
                  value={ticketForm.quantity}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, quantity: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} ticket{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedWorkshop(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Purchase
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

