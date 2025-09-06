"use client"

import { useShared } from "@/hooks/use-shared"
import Link from "next/link"
import { Badge } from "./ui/badge"

export function ServicesLanding() {
  const { servicesQuery } = useShared()
  const { data: services, isLoading: isLoadingServices } = servicesQuery

  // Função para embaralhar array e pegar 10 aleatórios
  const getRandomServices = (services: any[], count: number) => {
    const shuffled = [...services].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const randomServices = services ? getRandomServices(services, 10) : []

  return (
    <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
      {randomServices.map((service) => (
        <Link key={service?.id} href={`/providers?service=${encodeURIComponent(service?.id)}`}>
          <Badge
            variant="secondary"
            className="text-sm py-2 px-4 hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer bg-secondary/10 text-secondary border-secondary/20"
          >
            {service?.name}
          </Badge>
        </Link>
      ))}
    </div>
  )
}