"use client";

import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { carouselData } from "@/utils/carouselData";

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white ">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Spill</h1>

          <h1 className="text-xl md:text-3xl font-bold">
            Get Anonymous Feedbacks
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          className=" w-full max-w-lg md:max-w-xl"
          plugins={[Autoplay({ delay: 2000 })]}
        >
          <CarouselContent>
            {carouselData.map((item, index) => {
              return (
                <>
                  {console.log(item)}
                  <CarouselItem key={item.name} className="p-4 mb-14">
                    <Card>
                      <CardHeader>
                        <CardTitle>Message from {item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                        <div className=" flex flex-row">
                          <Mail className=" mr-4 flex-shrink-0" />
                          <div>
                            <p>{item.msg}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.date} ago
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                </>
              );
            })}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 Spill. All rights reserved.
      </footer>
    </>
  );
}
