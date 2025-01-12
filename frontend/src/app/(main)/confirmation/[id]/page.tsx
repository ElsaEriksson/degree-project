import { fetchOrderById } from "@/app/lib/data";

type PageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
  params: Promise<{ id: string }>;
};

export default async function Confirmation(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const orderId = (await props.params).id || "";
  const data = await fetchOrderById(orderId);

  if (!data) return <div>Error creating receipt</div>;

  const date = new Date(data.created_at);

  return (
    <>
      <div className="min-h-screen pt-36 lg:pt-28 bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[400px] md:max-w-[500px] ">
          {/* Receipt Paper Effect */}
          <div className="relative bg-white shadow-lg">
            {/* Serrated Edge Top */}
            <div
              className="absolute top-0 left-0 right-0 h-4 bg-white"
              style={{
                clipPath:
                  "polygon(0% 0%, 100% 0%, 100% 100%, 95% 50%, 90% 100%, 85% 50%, 80% 100%, 75% 50%, 70% 100%, 65% 50%, 60% 100%, 55% 50%, 50% 100%, 45% 50%, 40% 100%, 35% 50%, 30% 100%, 25% 50%, 20% 100%, 15% 50%, 10% 100%, 5% 50%, 0% 100%)",
              }}
            />

            {/* Receipt Content */}
            <div className="pt-8 px-6 pb-8 font-mono text-sm md:text-lg">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-xl md:text-[28px] font-bold mb-1 uppercase">
                  Handcrafted Hats
                </h1>
                <p className="text-xs md:text-base">
                  123 Style Avenue, Fashion District
                </p>
                <p className="text-xs md:text-base">Tel: +1 234 567 8900</p>
                <div className="border-b border-dashed my-4" />
                <p className="text-xs md:text-base">{date.toLocaleString()}</p>
              </div>

              {/* Order Details */}
              <div className="mb-4">
                <p className="font-bold">ORDER #{data.order_id}</p>
                <p className="capitalize">
                  {data.first_name} {data.last_name}
                </p>
              </div>

              {/* Items */}
              <div className="mb-4">
                <div className="border-b border-dashed mb-2" />
                <div className="grid grid-cols-12 text-xs font-bold md:text-base">
                  <span className="col-span-1">QTY</span>
                  <span className="col-span-8">ITEM</span>
                  <span className="col-span-3 text-right">AMOUNT</span>
                </div>
                <div className="border-b border-dashed mt-2 mb-2" />

                {data.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 text-xs mb-1 md:text-base"
                  >
                    <span className="col-span-1">{item.quantity}</span>
                    <span className="col-span-8">
                      {item.product_name} ({item.size})
                    </span>
                    <span className="col-span-3 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-dashed pt-2 mb-4">
                <div className="flex justify-between font-bold">
                  <span className="text-base">SHIPPING</span>
                  <span className="text-base">$5.00</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>${data.total_price}</span>
                </div>
              </div>

              {/* Shipping */}
              <div className="text-xs mb-4 md:text-base">
                <p className="font-bold mb-1">SHIPPING TO:</p>
                <p className="capitalize">{data.shipping_address}</p>
                <p className="capitalize">
                  {data.city}, {data.postal_code}
                </p>
                <p className="mt-1">Est. Delivery: 1-3 business days</p>
              </div>

              {/* Footer */}
              <div className="text-center text-xs md:text-base">
                <div className="border-b border-dashed mb-4" />
                <p className="font-bold mb-2">THANK YOU FOR SHOPPING!</p>
                <p>Questions? Contact us at:</p>
                <p>support@handcraftedhats.com</p>
              </div>
            </div>

            {/* Serrated Edge Bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-4 bg-white"
              style={{
                clipPath:
                  "polygon(0% 0%, 5% 50%, 10% 0%, 15% 50%, 20% 0%, 25% 50%, 30% 0%, 35% 50%, 40% 0%, 45% 50%, 50% 0%, 55% 50%, 60% 0%, 65% 50%, 70% 0%, 75% 50%, 80% 0%, 85% 50%, 90% 0%, 95% 50%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
