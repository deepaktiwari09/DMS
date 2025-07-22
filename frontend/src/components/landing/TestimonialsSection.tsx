const testimonials = [
  {
    id: 1,
    quote: "DealerFlow has transformed our sales process. We're closing deals 25% faster and our team has never been more efficient. It's a game-changer!",
    author: "John Doe",
    position: "General Manager, Apex Motors",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: 2,
    quote: "The inventory management module is incredibly powerful. We have real-time visibility on our stock, which has significantly reduced carrying costs.",
    author: "Jane Smith",
    position: "Owner, Two-Wheel Titans",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  },
  {
    id: 3,
    quote: "Our service department runs like a well-oiled machine thanks to DealerFlow. Customer satisfaction is at an all-time high.",
    author: "Samuel Green",
    position: "Service Director, Velocity Auto",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="typography_h2">
            Trusted by Dealerships Nationwide
          </h2>
          <p className="typography_body max-w-3xl mx-auto">
            See what our satisfied customers have to say about DealerFlow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <p className="typography_body mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img
                  alt={`Avatar of ${testimonial.author}`}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  src={testimonial.avatar}
                />
                <div>
                  <p className="font-bold text-[var(--text-primary)]">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}