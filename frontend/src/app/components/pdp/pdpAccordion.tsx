import clsx from "clsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ProductWithVariants } from "@/app/lib/definitions";

export default function PdpAccordion({
  product,
}: {
  product: ProductWithVariants;
}) {
  const accordionTriggerClasses =
    "w-full flex h-[48px] lg:h-[100px] grow items-center justify-between rounded-md bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:p-2 md:px-5";
  const accordionContentClasses =
    "flex flex-col space-y-2 px-4 md:px-8 pt-4 lg:w-2/3 md:text-base lg:text-lg font-light";
  const containerHeadlineClasses = "flex items-center gap-2";
  const headlineClasses = "md:text-lg lg:text-xl uppercase";

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full py-8 md:py-12 lg:py-16"
      >
        <AccordionItem value="details" className="border-gray-400 border-t">
          <AccordionTrigger className={clsx(accordionTriggerClasses)}>
            <div className={containerHeadlineClasses}>
              <p className={headlineClasses}>Details</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className={accordionContentClasses}>
              <p>Material: {product.material}</p>
              <p>Gender: {product.gender}</p>
              <p>Season: {product.season}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="deliveryAndPayment" className="border-gray-400">
          <AccordionTrigger className={clsx(accordionTriggerClasses)}>
            <div className={containerHeadlineClasses}>
              <p className={headlineClasses}>Delivery & Payment</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className={accordionContentClasses}>
              <p>Payment methods: Credit / Debit card</p>
              <p className="underline">How will I receive my order? </p>
              <p>
                All orders within Sweden are sent with Postnord home delivery or
                to your nearest pickup point.
              </p>
              <p>
                Orders to the rest of the world are sent with DHL or UPS. Always
                traceable.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="reviews" className="border-gray-400">
          <AccordionTrigger className={clsx(accordionTriggerClasses)}>
            <div className={containerHeadlineClasses}>
              <p className={headlineClasses}>Reviews</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className={accordionContentClasses}>
              <p>No reviews yet.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
