import { Shield, Clock, BadgePercent, Headphones } from "lucide-react"

const features = [
  {
    icon: BadgePercent,
    title: "Best Price Guarantee",
    description: "Find a lower price? We'll match it and give you an extra 10% off.",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Your payment and personal information are always protected.",
  },
  {
    icon: Clock,
    title: "Free Cancellation",
    description: "Plans change. That's why we offer free cancellation on most rooms.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer support team is available around the clock to help.",
  },
]

export function WhyBookWithUs() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-balance">Why Book With Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">We make booking easy and worry-free</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
