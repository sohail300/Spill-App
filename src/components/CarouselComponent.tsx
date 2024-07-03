"use client";

import React from "react";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { carouselData } from "@/utils/carouselData";

const CarouselComponent = () => {
  return (
    <Carousel
      className=" w-full max-w-lg md:max-w-xl"
      plugins={[Autoplay({ delay: 2000 })]}
    >
      <CarouselContent>
        {carouselData.map((item, index) => {
          return (
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
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselComponent;
