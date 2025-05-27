"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeftIcon, ArrowRightIcon, FilterIcon, WifiIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface Bus {
  id: string
  operator: string
  busType: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  seatsAvailable: number
  rating: number
  amenities: string[]
}

export default function BusesPage() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(true)
  const [priceRange, setPriceRange] = useState([200, 1500])
  const [departureTime, setDepartureTime] = useState<string[]>([])
  const [busTypes, setBusTypes] = useState<string[]>([])

  // Fetch buses data
  useEffect(() => {
    // Simulate API call
    const fetchBuses = async () => {
      setLoading(true)
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockBuses: Bus[] = [
          {
            id: "bus1",
            operator: "Express Travels",
            busType: "AC Sleeper",
            departureTime: "07:30",
            arrivalTime: "11:30",
            duration: "4h 00m",
            price: 650,
            seatsAvailable: 23,
            rating: 4.5,
            amenities: ["WiFi", "USB Charging", "Blanket", "Water Bottle"],
          },
          {
            id: "bus2",
            operator: "Royal Coaches",
            busType: "Non-AC Seater",
            departureTime: "08:45",
            arrivalTime: "13:15",
            duration: "4h 30m",
            price: 350,
            seatsAvailable: 15,
            rating: 3.8,
            amenities: ["Water Bottle"],
          },
          {
            id: "bus3",
            operator: "City Link",
            busType: "AC Seater",
            departureTime: "10:00",
            arrivalTime: "14:00",
            duration: "4h 00m",
            price: 450,
            seatsAvailable: 32,
            rating: 4.2,
            amenities: ["WiFi", "USB Charging", "Water Bottle"],
          },
          {
            id: "bus4",
            operator: "Luxury Lines",
            busType: "AC Sleeper",
            departureTime: "13:30",
            arrivalTime: "18:00",
            duration: "4h 30m",
            price: 750,
            seatsAvailable: 8,
            rating: 4.7,
            amenities: ["WiFi", "USB Charging", "Blanket", "Water Bottle", "Snacks"],
          },
          {
            id: "bus5",
            operator: "Highway Express",
            busType: "Non-AC Sleeper",
            departureTime: "16:15",
            arrivalTime: "20:45",
            duration: "4h 30m",
            price: 400,
            seatsAvailable: 19,
            rating: 3.5,
            amenities: ["Water Bottle"],
          },
          {
            id: "bus6",
            operator: "Night Rider",
            busType: "AC Sleeper",
            departureTime: "22:00",
            arrivalTime: "02:30",
            duration: "4h 30m",
            price: 600,
            seatsAvailable: 27,
            rating: 4.3,
            amenities: ["WiFi", "USB Charging", "Blanket", "Water Bottle"],
          },
        ]
        setBuses(mockBuses)
        setLoading(false)
      }, 1500)
    }

    fetchBuses()
  }, [from, to, date])

  // Filter buses based on selected filters
  const filteredBuses = buses.filter((bus) => {
    const matchesPrice = bus.price >= priceRange[0] && bus.price <= priceRange[1]
    const matchesDeparture =
      departureTime.length === 0 ||
      (departureTime.includes("morning") &&
        Number.parseInt(bus.departureTime.split(":")[0]) >= 6 &&
        Number.parseInt(bus.departureTime.split(":")[0]) < 12) ||
      (departureTime.includes("afternoon") &&
        Number.parseInt(bus.departureTime.split(":")[0]) >= 12 &&
        Number.parseInt(bus.departureTime.split(":")[0]) < 18) ||
      (departureTime.includes("evening") &&
        Number.parseInt(bus.departureTime.split(":")[0]) >= 18 &&
        Number.parseInt(bus.departureTime.split(":")[0]) < 22) ||
      (departureTime.includes("night") &&
        (Number.parseInt(bus.departureTime.split(":")[0]) >= 22 ||
          Number.parseInt(bus.departureTime.split(":")[0]) < 6))
    const matchesBusType = busTypes.length === 0 || busTypes.some((type) => bus.busType.includes(type))

    return matchesPrice && matchesDeparture && matchesBusType
  })

  const handleDepartureTimeChange = (value: string) => {
    setDepartureTime((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const handleBusTypeChange = (value: string) => {
    setBusTypes((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "EEE, dd MMM yyyy")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center gap-2 font-bold text-xl">
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-primary">BusGo</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm font-medium">
              {from} to {to} | {formatDate(date)}
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                Modify
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 space-y-6">
            <div className="font-medium text-lg">Filters</div>

            <div className="space-y-4">
              <div className="font-medium">Price Range</div>
              <div className="px-2">
                <Slider
                  defaultValue={[200, 1500]}
                  min={200}
                  max={1500}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <div>₹{priceRange[0]}</div>
                  <div>₹{priceRange[1]}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="font-medium">Departure Time</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="morning"
                    checked={departureTime.includes("morning")}
                    onCheckedChange={() => handleDepartureTimeChange("morning")}
                  />
                  <Label htmlFor="morning">Morning (6 AM - 12 PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="afternoon"
                    checked={departureTime.includes("afternoon")}
                    onCheckedChange={() => handleDepartureTimeChange("afternoon")}
                  />
                  <Label htmlFor="afternoon">Afternoon (12 PM - 6 PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="evening"
                    checked={departureTime.includes("evening")}
                    onCheckedChange={() => handleDepartureTimeChange("evening")}
                  />
                  <Label htmlFor="evening">Evening (6 PM - 10 PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="night"
                    checked={departureTime.includes("night")}
                    onCheckedChange={() => handleDepartureTimeChange("night")}
                  />
                  <Label htmlFor="night">Night (10 PM - 6 AM)</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="font-medium">Bus Type</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ac"
                    checked={busTypes.includes("AC")}
                    onCheckedChange={() => handleBusTypeChange("AC")}
                  />
                  <Label htmlFor="ac">AC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="non-ac"
                    checked={busTypes.includes("Non-AC")}
                    onCheckedChange={() => handleBusTypeChange("Non-AC")}
                  />
                  <Label htmlFor="non-ac">Non-AC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sleeper"
                    checked={busTypes.includes("Sleeper")}
                    onCheckedChange={() => handleBusTypeChange("Sleeper")}
                  />
                  <Label htmlFor="sleeper">Sleeper</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="seater"
                    checked={busTypes.includes("Seater")}
                    onCheckedChange={() => handleBusTypeChange("Seater")}
                  />
                  <Label htmlFor="seater">Seater</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Filters - Mobile */}
          <div className="md:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Adjust filters to find the perfect bus</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="font-medium">Price Range</div>
                    <div className="px-2">
                      <Slider
                        defaultValue={[200, 1500]}
                        min={200}
                        max={1500}
                        step={50}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <div>₹{priceRange[0]}</div>
                        <div>₹{priceRange[1]}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="font-medium">Departure Time</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="morning-mobile"
                          checked={departureTime.includes("morning")}
                          onCheckedChange={() => handleDepartureTimeChange("morning")}
                        />
                        <Label htmlFor="morning-mobile">Morning (6 AM - 12 PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="afternoon-mobile"
                          checked={departureTime.includes("afternoon")}
                          onCheckedChange={() => handleDepartureTimeChange("afternoon")}
                        />
                        <Label htmlFor="afternoon-mobile">Afternoon (12 PM - 6 PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="evening-mobile"
                          checked={departureTime.includes("evening")}
                          onCheckedChange={() => handleDepartureTimeChange("evening")}
                        />
                        <Label htmlFor="evening-mobile">Evening (6 PM - 10 PM)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="night-mobile"
                          checked={departureTime.includes("night")}
                          onCheckedChange={() => handleDepartureTimeChange("night")}
                        />
                        <Label htmlFor="night-mobile">Night (10 PM - 6 AM)</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="font-medium">Bus Type</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ac-mobile"
                          checked={busTypes.includes("AC")}
                          onCheckedChange={() => handleBusTypeChange("AC")}
                        />
                        <Label htmlFor="ac-mobile">AC</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="non-ac-mobile"
                          checked={busTypes.includes("Non-AC")}
                          onCheckedChange={() => handleBusTypeChange("Non-AC")}
                        />
                        <Label htmlFor="non-ac-mobile">Non-AC</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sleeper-mobile"
                          checked={busTypes.includes("Sleeper")}
                          onCheckedChange={() => handleBusTypeChange("Sleeper")}
                        />
                        <Label htmlFor="sleeper-mobile">Sleeper</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="seater-mobile"
                          checked={busTypes.includes("Seater")}
                          onCheckedChange={() => handleBusTypeChange("Seater")}
                        />
                        <Label htmlFor="seater-mobile">Seater</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Bus List */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <div className="font-medium">
                {loading ? <Skeleton className="h-6 w-40" /> : `${filteredBuses.length} buses found`}
              </div>
              <div className="text-sm text-muted-foreground">
                {from} to {to}
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-40" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-10 w-24" />
                          <Skeleton className="h-10 w-24" />
                          <Skeleton className="h-10 w-24" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-10 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredBuses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-lg font-medium">No buses found</div>
                <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBuses.map((bus) => (
                  <Card key={bus.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-medium text-lg">{bus.operator}</div>
                            <div className="text-sm text-muted-foreground">{bus.busType}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl text-primary">₹{bus.price}</div>
                            <div className="text-sm text-muted-foreground">{bus.seatsAvailable} seats left</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <div className="text-center">
                            <div className="font-medium text-lg">{bus.departureTime}</div>
                            <div className="text-sm text-muted-foreground">{from}</div>
                          </div>

                          <div className="flex-1 px-4">
                            <div className="relative flex items-center">
                              <div className="h-1 flex-1 bg-border"></div>
                              <div className="mx-2 text-xs text-muted-foreground">{bus.duration}</div>
                              <div className="h-1 flex-1 bg-border"></div>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="font-medium text-lg">{bus.arrivalTime}</div>
                            <div className="text-sm text-muted-foreground">{to}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {bus.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {amenity === "WiFi" && <WifiIcon className="h-3 w-3" />}
                              {amenity}
                            </Badge>
                          ))}
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="details" className="border-b-0">
                            <AccordionTrigger className="py-2 text-sm text-muted-foreground">
                              View Details
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-sm font-medium">Boarding Point</div>
                                    <div className="text-sm text-muted-foreground">Main Bus Stand, {from}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">Dropping Point</div>
                                    <div className="text-sm text-muted-foreground">Central Bus Terminal, {to}</div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium">Cancellation Policy</div>
                                  <div className="text-sm text-muted-foreground">
                                    <ul className="list-disc list-inside">
                                      <li>{">"} 24 hours: 75% refund</li>
                                      <li>12-24 hours: 50% refund</li>
                                      <li>{"<"} 12 hours: No refund</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      <div className="bg-muted p-4 flex justify-end">
                        <Link href={`/buses/${bus.id}/seats?from=${from}&to=${to}&date=${date}`}>
                          <Button>
                            Select Seats
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

