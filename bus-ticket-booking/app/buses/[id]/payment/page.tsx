"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, QrCodeIcon, WalletIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const date = searchParams.get("date") || ""
  const seats = searchParams.get("seats") || ""
  const amount = searchParams.get("amount") || "0"

  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })
  const [processing, setProcessing] = useState(false)

  const handleUpiPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!upiId) return

    setProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      router.push(`/buses/${params.id}/confirmation?from=${from}&to=${to}&date=${date}&seats=${seats}&amount=${amount}`)
    }, 2000)
  }

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) return

    setProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      router.push(`/buses/${params.id}/confirmation?from=${from}&to=${to}&date=${date}&seats=${seats}&amount=${amount}`)
    }, 2000)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return format(date, "EEE, dd MMM yyyy")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link
            href={`/buses/${params.id}/seats?from=${from}&to=${to}&date=${date}`}
            className="mr-6 flex items-center gap-2 font-bold text-xl"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-primary">Payment</span>
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
          {/* Payment Methods */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Choose Payment Method</CardTitle>
                <CardDescription>Select your preferred payment option</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upi" onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upi">UPI</TabsTrigger>
                    <TabsTrigger value="card">Card</TabsTrigger>
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upi" className="space-y-4 pt-4">
                    <div className="flex justify-center mb-4">
                      <QrCodeIcon className="h-32 w-32 text-muted-foreground" />
                    </div>

                    <form onSubmit={handleUpiPayment}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="upi-id">UPI ID</Label>
                          <Input
                            id="upi-id"
                            placeholder="username@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter your UPI ID (e.g., name@okbank, name@upi)
                          </p>
                        </div>

                        <RadioGroup defaultValue="pay">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pay" id="pay" />
                            <Label htmlFor="pay">Pay</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="collect" id="collect" />
                            <Label htmlFor="collect">Collect</Label>
                          </div>
                        </RadioGroup>

                        <Button type="submit" className="w-full" disabled={!upiId || processing}>
                          {processing ? "Processing..." : "Pay ₹" + amount}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="card" className="space-y-4 pt-4">
                    <form onSubmit={handleCardPayment}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="card-name">Name on Card</Label>
                          <Input
                            id="card-name"
                            placeholder="John Doe"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              type="password"
                              maxLength={3}
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={
                            !cardDetails.number ||
                            !cardDetails.name ||
                            !cardDetails.expiry ||
                            !cardDetails.cvv ||
                            processing
                          }
                        >
                          {processing ? "Processing..." : "Pay ₹" + amount}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="wallet" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <WalletIcon className="h-12 w-12 mb-2 text-primary" />
                          <div className="font-medium">Paytm</div>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <WalletIcon className="h-12 w-12 mb-2 text-primary" />
                          <div className="font-medium">PhonePe</div>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <WalletIcon className="h-12 w-12 mb-2 text-primary" />
                          <div className="font-medium">Google Pay</div>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:bg-accent">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <WalletIcon className="h-12 w-12 mb-2 text-primary" />
                          <div className="font-medium">Amazon Pay</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Button className="w-full">Continue with Selected Wallet</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>
                  {from} to {to} | {formatDate(date)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Seats</div>
                  <div className="text-sm">{seats.split(",").join(", ")}</div>
                </div>

                <div className="flex justify-between">
                  <div className="text-sm font-medium">Base Fare</div>
                  <div className="text-sm">₹{Number.parseInt(amount) - 50}</div>
                </div>

                <div className="flex justify-between">
                  <div className="text-sm font-medium">Service Fee</div>
                  <div className="text-sm">₹50</div>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <div>Total Amount</div>
                  <div>₹{amount}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

