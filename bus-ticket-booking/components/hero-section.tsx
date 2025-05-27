import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="Bus travel"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>
      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-lg space-y-6 text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Book Bus Tickets Online</h1>
          <p className="text-lg md:text-xl">
            Real-time bus schedules, easy booking, and secure UPI payments. Travel smarter with BusGo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="font-medium">
              Book Now
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Download App
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

