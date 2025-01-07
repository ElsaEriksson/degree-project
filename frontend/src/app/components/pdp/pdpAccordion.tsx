import clsx from "clsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ProductWithVariants } from "@/app/models/Product";

export default function PdpAccordion({
  product,
}: {
  product: ProductWithVariants;
}) {
  return (
    <>
      {" "}
      <Accordion
        type="single"
        collapsible
        className="w-full py-8 md:py-12 lg:py-16"
      >
        <AccordionItem value="details" className="border-gray-400 border-t">
          <AccordionTrigger
            className={clsx(
              "w-full flex h-[48px] lg:h-[100px] grow items-center justify-between rounded-md bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:p-2 md:px-5"
            )}
          >
            <div className="flex items-center gap-2">
              <p className="md:text-lg lg:text-xl uppercase">Details</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2 px-4 md:px-8 pt-4 lg:w-2/3">
              <p className="md:text-base lg:text-lg font-light">
                Material: {product.material}
              </p>
              <p className="md:text-base lg:text-lg font-light">
                Gender: {product.gender}
              </p>
              <p className="md:text-base lg:text-lg font-light">
                Season: {product.season}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deliveryAndPayment" className="border-gray-400">
          <AccordionTrigger
            className={clsx(
              "w-full flex h-[48px] lg:h-[100px] grow items-center justify-between rounded-md bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:p-2 md:px-5"
            )}
          >
            <div className="flex items-center gap-2">
              <p className=" md:text-lg lg:text-xl  uppercase">
                Delivery & Payment
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2 pl-8 pt-4 w-2/3">
              <p className="lg:text-base">
                Description: {product.description_long}
              </p>
              <p className="lg:text-base">Material: {product.material}</p>
              <p className="lg:text-base">Gender: {product.gender}</p>
              <p className="lg:text-base">Season: {product.season}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="reviews" className="border-gray-400">
          <AccordionTrigger
            className={clsx(
              "w-full flex h-[48px] lg:h-[100px] grow items-center justify-between rounded-md bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:p-2 md:px-5"
            )}
          >
            <div className="flex items-center gap-2">
              <p className="md:text-lg lg:text-xl  uppercase">Reviews</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2 pl-8 w-2/3">
              <p className="lg:text-base">
                Description: {product.description_long}
              </p>
              <p className="lg:text-base">Material: {product.material}</p>
              <p className="lg:text-base">Gender: {product.gender}</p>
              <p className="lg:text-base">Season: {product.season}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
