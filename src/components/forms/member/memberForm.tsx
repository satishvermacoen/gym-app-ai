"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner";

const schema = z.object({
  // profilePicUrl: z.string().optional(),
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Date of birth is required",
    }),
    gender: z.string().min(1, "Gender is required"),
    address: z.object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      pinCode: z.string().min(1, "Pin Code is required"),
    }),
    email: z.email("Invalid email"),
    mobileNumberMain: z.string().min(10, "Invalid mobile number"),
    alternateMobile: z.string().optional(),
    physicalStats: z.object({
      weightKg: z.number().min(1, "Weight is required"),
      heightCm: z.number().min(1, "Height is required"),
    }),
  }),
  membershipInfo: z.object({
    membershiptype: z.string().min(1, "Select membership type"),
    duration: z.string().min(1, "Select duration"),
    preferredStartDate: z.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Select start date",
    }),
    specialRequests: z.string().optional(),
    classInterests: z.string().optional(),
  }),
  emergencyContactInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    mobileNumber: z.string().min(10, "Invalid mobile number"),
  }),
})

export function AddMemberForm() {
  const [membershipTypes, setMembershipTypes] = useState<string[]>([])
  const [durations, setDurations] = useState<string[]>([])
  const [classes, setClasses] = useState<string[]>([])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      // profilePicUrl: "",
      personalInfo: {
        firstName: "",
        lastName: "",
        dateOfBirth: undefined,
        gender: "",
        address: { street: "", city: "", state: "", pinCode: "" },
        email: "",
        mobileNumberMain: "",
        alternateMobile: "",
        physicalStats: { weightKg: 0, heightCm: 0 },
      },
      membershipInfo: {
        membershiptype: "",
        duration: "",
        preferredStartDate: undefined,
        specialRequests: "",
        classInterests: "",
      },
      emergencyContactInfo: {
        fullName: "",
        relationship: "",
        mobileNumber: "",
      },
    },
  })

  // Fetch dropdown options from backend
  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch("/api/members/options") // your backend endpoint
        const data = await res.json()
        setMembershipTypes(data.membershipTypes || [])
        setDurations(data.durations || [])
        setClasses(data.classInterests || [])
      } catch (error) {
        console.error("Error fetching options", error)
      }
    }
    fetchOptions()
  }, [])

  async function onSubmit(values: z.infer<typeof schema>) {
    const payload = {
      ...values,
      personalInfo: {
        ...values.personalInfo,
        dateOfBirth: values.personalInfo.dateOfBirth.toISOString(),
      },
      membershipInfo: {
        ...values.membershipInfo,
        preferredStartDate: values.membershipInfo.preferredStartDate.toISOString(),
      },
    }

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to add member")

      toast(`${values.personalInfo.firstName} ${values.personalInfo.lastName} has been added. Member added successfully.`);
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Picture */}
      {/* <div>
        <Label>Profile Picture</Label>
        <Input type="url" placeholder="Profile picture URL" {...form.register("profilePicUrl")} />
      </div> */}

      {/* Personal Info */}
      <section>
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="First Name" {...form.register("personalInfo.firstName")} />
          <Input placeholder="Last Name" {...form.register("personalInfo.lastName")} />

          {/* DOB Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("personalInfo.dateOfBirth")
                  ? format(form.watch("personalInfo.dateOfBirth"), "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={form.watch("personalInfo.dateOfBirth")}
                onSelect={(date) => form.setValue("personalInfo.dateOfBirth", date!)}
              />
            </PopoverContent>
          </Popover>

          {/* Gender */}
          <Select onValueChange={(val) => form.setValue("personalInfo.gender", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Street" {...form.register("personalInfo.address.street")} />
          <Input placeholder="City" {...form.register("personalInfo.address.city")} />
          <Input placeholder="State" {...form.register("personalInfo.address.state")} />
          <Input placeholder="Pin Code" {...form.register("personalInfo.address.pinCode")} />
          <Input placeholder="Email" type="email" {...form.register("personalInfo.email")} />
          <Input placeholder="Main Mobile" {...form.register("personalInfo.mobileNumberMain")} />
          <Input placeholder="Alternate Mobile" {...form.register("personalInfo.alternateMobile")} />
          <Input placeholder="Weight (kg)" type="number" {...form.register("personalInfo.physicalStats.weightKg", { valueAsNumber: true })} />
          <Input placeholder="Height (cm)" type="number" {...form.register("personalInfo.physicalStats.heightCm", { valueAsNumber: true })} />
        </div>
      </section>

      {/* Membership Info */}
      <section>
        <h2 className="text-lg font-semibold">Membership Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <Select onValueChange={(val) => form.setValue("membershipInfo.membershiptype", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Membership Type" />
            </SelectTrigger>
            <SelectContent>
              {membershipTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => form.setValue("membershipInfo.duration", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Preferred Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("membershipInfo.preferredStartDate")
                  ? format(form.watch("membershipInfo.preferredStartDate"), "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={form.watch("membershipInfo.preferredStartDate")}
                onSelect={(date) => form.setValue("membershipInfo.preferredStartDate", date!)}
              />
            </PopoverContent>
          </Popover>

          <Textarea placeholder="Special Requests" {...form.register("membershipInfo.specialRequests")} />
          <Select onValueChange={(val) => form.setValue("membershipInfo.classInterests", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Class Interests" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Emergency Contact Info */}
      <section>
        <h2 className="text-lg font-semibold">Emergency Contact Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Full Name" {...form.register("emergencyContactInfo.fullName")} />
          <Input placeholder="Relationship" {...form.register("emergencyContactInfo.relationship")} />
          <Input placeholder="Mobile Number" {...form.register("emergencyContactInfo.mobileNumber")} />
        </div>
      </section>

      {/* Submit */}
      <Button type="submit" className="w-full">Add Member</Button>
    </form>
  )
}
