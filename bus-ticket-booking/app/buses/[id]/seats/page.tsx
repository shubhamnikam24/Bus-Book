"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { format } from "date-fns"

interface Seat {
  id: string
  number: string
  type: "sleeper" | "seater"
  status: "available" | "booked" | "selected"
  price: number
}

export default function SeatsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const date = searchParams.get("date") || ""

  const [loading, setLoading] = useState(true)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [busDetails, setBusDetails] = useState({
    operator: "",
    busType: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
  })

  useEffect(() => {
    // Simulate API call to fetch bus details and seats
    const fetchBusDetails = async () => {
      setLoading(true)
      // In a real app, this would be an API call
      setTimeout(() => {
        setBusDetails({
          operator: "Express Travels",
          busType: "AC Sleeper",
          departureTime: "07:30",
          arrivalTime: "11:30",
          duration: "4h 00m",
        })

        // Generate mock seats data
        const mockSeats: Seat[] = []

        // Generate sleeper seats (upper and lower berths)
        for (let i = 1; i <= 10; i++) {
          // Lower berth
          mockSeats.push({
            id: `L${i}`,
            number: `L${i}`,
            type: "sleeper",
            status: Math.random() > 0.3 ? "available" : "booked",
            price: 650,
          })

          // Upper berth
          mockSeats.push({
            id: `U${i}`,
            number: `U${i}`,
            type: "sleeper",
            status: Math.random() > 0.3 ? "available" : "booked",
            price: 600,
          })
        }

        // Generate seater seats
        for (let i = 1; i <= 20; i++) {
          mockSeats.push({
            id: `S${i}`,
            number: `S${i}`,
            type: "seater",
            status: Math.random() > 0.3 ? "available" : "booked",
            price: 550,
          })
        }

        setSeats(mockSeats)
        setLoading(false)
      }, 1500)
    }

    fetchBusDetails()
  }, [params.id])

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "booked") return

    if (seat.status === "available") {
      // Select the seat
      const updatedSeats = seats.map((s) => (s.id === seat.id ? { ...s, status: "selected" } : s))
      setSeats(updatedSeats)
      setSelectedSeats([...selectedSeats, seat])
    } else {
      // Deselect the seat
      const updatedSeats = seats.map((s) => (s.id === seat.id ? { ...s, status: "available" } : s))
      setSeats(updatedSeats)
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id))
    }
  }

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return format(date, "EEE, dd MMM yyyy")
  }

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return

    const seatIds = selectedSeats.map((seat) => seat.id).join(",")
    router.push(`/buses/${params.id}/payment?from=${from}&to=${to}&date=${date}&seats=${seatIds}&amount=${totalAmount}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link
            href={`/buses?from=${from}&to=${to}&date=${date}`}
            className="mr-6 flex items-center gap-2 font-bold text-xl"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-primary">Select Seats</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm font-medium">
              {from} to {to} | {formatDate(date)}
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Seat Layout */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Seats</CardTitle>
                <CardDescription>
                  {loading ? <Skeleton className="h-4 w-48" /> : `${busDetails.operator} - ${busDetails.busType}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-sm border border-gray-300 bg-white"></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-sm bg-gray-300"></div>
                        <span className="text-sm">Booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-sm bg-primary"></div>
                        <span className="text-sm">Selected</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        <div className="mb-4 text-center text-sm font-medium">Front of the Bus</div>

                        {/* Driver's seat */}
                        <div className="flex justify-end mb-6">
                          <div className="h-8 w-8 rounded-sm bg-gray-300 flex items-center justify-center text-xs">
                            D
                          </div>
                        </div>

                        {/* Sleeper section */}
                        <div className="mb-8">
                          <div className="text-sm font-medium mb-2">Sleeper Section</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-xs text-center mb-1">Lower Berth</div>
                              <div className="grid grid-cols-5 gap-2">
                                {seats
                                  .filter((seat) => seat.number.startsWith("L"))
                                  .map((seat) => (
                                    <TooltipProvider key={seat.id}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className={`h-8 w-8 rounded-sm flex items-center justify-center text-xs ${
                                              seat.status === "available"
                                                ? "border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer"
                                                : seat.status === "booked"
                                                  ? "bg-gray-300 cursor-not-allowed"
                                                  : "bg-primary text-primary-foreground cursor-pointer"
                                            }`}
                                            onClick={() => handleSeatClick(seat)}
                                            disabled={seat.status === "booked"}
                                          >
                                            {seat.number}
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div className="text-xs">
                                            <div>Seat: {seat.number}</div>
                                            <div>Price: ₹{seat.price}</div>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs text-center mb-1">Upper Berth</div>
                              <div className="grid grid-cols-5 gap-2">
                                {seats
                                  .filter((seat) => seat.number.startsWith("U"))
                                  .map((seat) => (
                                    <TooltipProvider key={seat.id}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className={`h-8 w-8 rounded-sm flex items-center justify-center text-xs ${
                                              seat.status === "available"
                                                ? "border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer"
                                                : seat.status === "booked"
                                                  ? "bg-gray-300 cursor-not-allowed"
                                                  : "bg-primary text-primary-foreground cursor-pointer"
                                            }`}
                                            onClick={() => handleSeatClick(seat)}
                                            disabled={seat.status === "booked"}
                                          >
                                            {seat.number}
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div className="text-xs">
                                            <div>Seat: {seat.number}</div>
                                            <div>Price: ₹{seat.price}</div>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Seater section */}
                        <div>
                          <div className="text-sm font-medium mb-2">Seater Section</div>
                          <div className="grid grid-cols-4 gap-2">
                            {seats
                              .filter((seat) => seat.number.startsWith("S"))
                              .map((seat) => (
                                <TooltipProvider key={seat.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        className={`h-8 w-8 rounded-sm flex items-center justify-center text-xs ${
                                          seat.status === "available"
                                            ? "border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer"
                                            : seat.status === "booked"
                                              ? "bg-gray-300 cursor-not-allowed"
                                              : "bg-primary text-primary-foreground cursor-pointer"
                                        }`}
                                        onClick={() => handleSeatClick(seat)}
                                        disabled={seat.status === "booked"}
                                      >
                                        {seat.number}
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-xs">
                                        <div>Seat: {seat.number}</div>
                                        <div>Price: ₹{seat.price}</div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>
                  {from} to {to} | {formatDate(date)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">Bus Operator</div>
                      <div className="text-sm">{busDetails.operator}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">Bus Type</div>
                      <div className="text-sm">{busDetails.busType}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">Departure</div>
                      <div className="text-sm">
                        {busDetails.departureTime}, {formatDate(date)}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">Duration</div>
                      <div className="text-sm">{busDetails.duration}</div>
                    </div>

                    <Separator />

                    <div>
                      <div className="text-sm font-medium mb-2">Selected Seats ({selectedSeats.length})</div>
                      {selectedSeats.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No seats selected</div>
                      ) : (
                        <div className="space-y-2">
                          {selectedSeats.map((seat) => (
                            <div key={seat.id} className="flex justify-between">
                              <div className="text-sm">Seat {seat.number}</div>
                              <div className="text-sm">₹{seat.price}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between font-medium">
                      <div>Total Amount</div>
                      <div>₹{totalAmount}</div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={loading || selectedSeats.length === 0}
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

