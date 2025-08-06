import {
  AudioWaveform,
  BetweenHorizontalStartIcon,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  IdCardLanyard,
  Map,
  PieChart,
  Settings,
  Settings2,
  SquareTerminal,
  User2Icon,
} from "lucide-react"

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconMoneybagHeart,
  IconZoomMoney,
 
} from "@tabler/icons-react"



export const branch = {
  branches: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
}

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  
  navMain: [
    {
      title: "Members",
      url: "/member",
      icon: User2Icon,
      isActive: true,
      items: [
        {
          title: "All Members",
          url: "/member",
        },
        {
          title: "Active",
          url: "/member/active",
        },
        {
          title: "In-Active",
          url: "/member/in-active",
        },
        {
          title: "Add New",
          url: "/member/add",
        },
      ],
    },
    {
      title: "Members",
      url: "/member",
      icon: IdCardLanyard,
      isActive: true,
      items: [
        {
          title: "All Employees",
          url: "/employee",
        },
        {
          title: "Active",
          url: "/employee/active",
        },
        {
          title: "In-Active",
          url: "/employee/in-active",
        },
        {
          title: "Add New",
          url: "/employee/add",
        },
      ],
    },
    {
      title: "Expense",
      url: "/expense",
      icon: IconZoomMoney,
      isActive: true,
      items: [
        {
          title: "Expenses",
          url: "/expense",
        },
        {
          title: "Manage",
          url: "/expense/manage",
        },
      ],
    },
    
  ],
  
}

export const data2 ={
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      isActive: true,
      
    },
    {
      title: "Branch",
      url: "/branch",
      icon: BetweenHorizontalStartIcon,
    },
    {
      title: "Finance",
      url: "#",
      icon: IconChartBar,
      isActive: false,
    },
    {
      title: "Members",
      url: "#",
      icon: User2Icon,
      isActive: false,
    },
    {
      title: "Employees",
      url: "#",
      icon: IdCardLanyard,
      isActive: false,
    },
    
    
  ]
}