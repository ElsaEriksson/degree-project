import { fetchOrdersByUserId } from "@/app/lib/data/getOrders";
import { auth } from "../../../auth";
import Order from "@/app/components/profile/order";

export default async function Page() {
  const session = await auth();

  const orders = await fetchOrdersByUserId(Number(session?.user.userId));

  const isOrderListEmpty = orders && orders.length === 0;

  return (
    <>
      <div className="min-h-screen relative py-28 bg-gray-100">
        <div className=" mx-2 md:mx-6 lg:mx-36 xl:mx-64">
          <h1 className="uppercase text-[40px] md:text-[70px] lg:text-[100px] text-center pb-4">
            Your Orders
          </h1>

          {/* Orders list */}
          {isOrderListEmpty ? (
            <div className="text-center text-gray-500 mt-10">
              No orders found.
            </div>
          ) : (
            <div className="space-y-4 flex flex-col-reverse">
              {orders &&
                orders.map((order, index) => (
                  <div
                    key={order.order_id}
                    className={index === 0 ? "pt-4" : ""}
                  >
                    <Order order={order} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
