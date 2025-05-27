import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"

const popularRoutes = [
  { from: "Mumbai", to: "Pune", price: "₹350", time: "3h 30m" },
  { from: "Delhi", to: "Jaipur", price: "₹550", time: "5h 15m" },
  { from: "Bangalore", to: "Chennai", price: "₹650", time: "6h 45m" },
  { from: "Hyderabad", to: "Vijayawada", price: "₹450", time: "4h 30m" },
  { from: "Kolkata", to: "Siliguri", price: "₹750", time: "8h 00m" },
  { from: "Ahmedabad", to: "Surat", price: "₹300", time: "3h 00m" },
]

export function PopularRoutes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Popular Routes</h2>
        <Link href="/routes" className="text-sm font-medium text-primary hover:underline">
          View all routes
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popularRoutes.map((route, index) => (
          <Link
            key={index}
            href={`/buses?from=${route.from}&to=${route.to}&date=${new Date().toISOString().split("T")[0]}`}
          >
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{route.from}</span>
                  <ArrowRightIcon className="h-4 w-4 mx-2 text-muted-foreground" />
                  <span>{route.to}</span>
                </CardTitle>
                <CardDescription>Daily buses available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="font-medium text-primary">{route.price}</div>
                  <div className="text-sm text-muted-foreground">{route.time}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

