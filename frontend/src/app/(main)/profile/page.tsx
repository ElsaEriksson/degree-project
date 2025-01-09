import { fetchOrdersByUserId } from "@/app/lib/data";
import { auth } from "../../../auth";
import Order from "@/app/components/profile/order";

export default async function Page() {
  const session = await auth();

  const orders = await fetchOrdersByUserId(Number(session?.user.userId));

  return (
    <>
      <div className="min-h-screen relative pt-28 bg-gray-100">
        <div className=" mx-2 md:mx-6 lg:mx-36 xl:mx-64">
          <h1 className="uppercase text-[40px] md:text-[70px] lg:text-[100px] text-center pb-4">
            Your Orders
          </h1>
          {orders && orders.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {orders &&
                orders.map((order) => (
                  <Order key={order.order_id} order={order} />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
