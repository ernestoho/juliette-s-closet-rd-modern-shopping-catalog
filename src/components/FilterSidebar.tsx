import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
const categories = ['All', 'Clothing', 'Home', 'Supplements', 'Amazon Various Items'];
interface FilterSidebarProps {
  onCategoryChange: (category: string) => void;
}
export function FilterSidebar({ onCategoryChange }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 500]);
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['category', 'price']} className="w-full">
          <AccordionItem value="category">
            <AccordionTrigger className="text-base">Category</AccordionTrigger>
            <AccordionContent>
              <RadioGroup defaultValue="All" onValueChange={onCategoryChange}>
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value={category} id={`cat-${category}`} />
                    <Label htmlFor={`cat-${category}`}>{category}</Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price">
            <AccordionTrigger className="text-base">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="p-2">
                <Slider
                  defaultValue={[500]}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}