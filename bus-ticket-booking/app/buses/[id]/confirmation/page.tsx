"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircleIcon, DownloadIcon, PrinterIcon, ShareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const date = searchParams.get("date") || ""
  const seats = searchParams.get("seats") || ""
  const amount = searchParams.get("amount") || "0"

  const [ticketNumber, setTicketNumber] = useState("")
  const [busDetails, setBusDetails] = useState({
    operator: "Express Travels",
    busType: "AC Sleeper",
    departureTime: "07:30",
    arrivalTime: "11:30",
    duration: "4h 00m",
  })

  useEffect(() => {
    // Generate a random ticket number
    const randomTicket =
      "BG" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
    setTicketNumber(randomTicket)
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return format(date, "EEE, dd MMM yyyy")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your ticket has been booked successfully. Ticket details have been sent to your email.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Ticket #{ticketNumber}</CardTitle>
                  <CardDescription>
                    {from} to {to} | {formatDate(date)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <PrinterIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ShareIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">From</div>
                  <div className="font-medium">{from}</div>
                  <div className="text-sm">
                    {busDetails.departureTime}, {formatDate(date)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">To</div>
                  <div className="font-medium">{to}</div>
                  <div className="text-sm">
                    {busDetails.arrivalTime}, {formatDate(date)}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Bus Details</div>
                  <div className="font-medium">{busDetails.operator}</div>
                  <div className="text-sm">
                    {busDetails.busType} | {busDetails.duration}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Seat(s)</div>
                  <div className="font-medium">{seats.split(",").join(", ")}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Passenger Details</div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm">+91 9876543210 | john.doe@example.com</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Base Fare</div>
                  <div className="text-sm">₹{Number.parseInt(amount) - 50}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Service Fee</div>
                  <div className="text-sm">₹50</div>
                </div>
                <div className="flex justify-between font-medium pt-2">
                  <div>Total Amount</div>
                  <div>₹{amount}</div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md text-sm">
                <div className="font-medium mb-1">Important Information:</div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Please arrive at the boarding point 15 minutes before departure.</li>
                  <li>Carry a valid ID proof for verification.</li>
                  <li>Cancellation charges apply as per policy.</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t p-6">
              <div className="w-full text-center">
                <div className="text-sm text-muted-foreground mb-4">
                  For any assistance, contact our 24/7 helpline: <span className="font-medium">1800-123-4567</span>
                </div>
                <Link href="/">
                  <Button>Back to Home</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

