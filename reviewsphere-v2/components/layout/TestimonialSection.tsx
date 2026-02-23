"use client";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Restaurant Manager",
      company: "Sofia's Italian Kitchen",
      content:
        "ReviewSphere saved us hours every week. We went from 2-3 hours responding to reviews to just 5 minutes. Our response rate went from 30% to 98%.",
      avatar: "👩‍💼",
      rating: 5,
    },
    {
      name: "James Chen",
      role: "Hotel Owner",
      company: "Riverside Boutique Hotel",
      content:
        "The AI understands our brand voice perfectly. Guests have commented that our responses feel more personal and engaging than ever before.",
      avatar: "👨‍💼",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Beauty Salon Owner",
      company: "Bloom Aesthetics",
      content:
        "Professional, personalized replies every single time. ReviewSphere handles negative reviews with such grace and professionalism. Highly impressed!",
      avatar: "👩‍🦱",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Loved by business owners worldwide
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            See how ReviewSphere helps businesses maintain their reputation and engage with customers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-8 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)",
                border: "1px solid rgba(0, 191, 166, 0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-lg">
                    ⭐
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-700 font-medium leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Hover accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100"
                style={{
                  background:
                    "linear-gradient(90deg, #00BFA6 0%, #5C6AC4 100%)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-20 text-center">
          <p className="text-slate-600 text-sm font-medium mb-4">
            Trusted by 500+ businesses across hospitality, retail, and services
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">4.9/5</div>
              <div className="text-xs text-slate-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">98%</div>
              <div className="text-xs text-slate-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">2.3K+</div>
              <div className="text-xs text-slate-600">Reviews Generated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
