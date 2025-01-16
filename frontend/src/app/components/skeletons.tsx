"use client";
// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm my-2`}
    >
      <div className="flex px-4 py-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="w-full border-t-2 py-2 flex flex-col gap-2">
        <div className="w-full rounded-md bg-gray-200 py-4"></div>
        <div className="w-full py-6 rounded-md bg-gray-200"></div>
      </div>
    </>
  );
}

export function AnimatedPlpSkeleton() {
  return (
    <div>
      <div className=" w-full px-2 md:px-6 pt-20">
        <div className="overflow-hidden px-2 pb-4 pt-6 text-gray-700 sm:px-4 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <div role="status" className="max-w-sm animate-pulse">
              <p className="mb-2.5 h-2 max-w-[320px] rounded-full bg-gray-300"></p>
            </div>
          </nav>
        </div>

        <main className=" mx-auto flex-1 px-4 py-8">
          <div role="status" className="max-w-sm animate-pulse">
            <h3 className="mb-4 h-3 w-48  rounded-full bg-gray-300"></h3>
            <p className="mb-2.5 h-2 max-w-[680px] rounded-full bg-gray-300"></p>
            <p className="mb-2.5 h-2 max-w-[640px] rounded-full bg-gray-300"></p>
            <p className="mb-2.5 h-2 max-w-[620px] rounded-full bg-gray-300"></p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                <div role="status" className="max-w-sm animate-pulse">
                  <h3 className="mb-4 h-3 w-48  rounded-full bg-gray-300"></h3>
                </div>
              </h1>
              <div role="status" className="max-w-sm animate-pulse">
                <h3 className="mb-4 h-3 w-48  rounded-full bg-gray-300"></h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-4 rounded-lg p-4">
                  <div className="relative overflow-hidden">
                    <div className="h-40 animate-pulse rounded bg-gray-200"></div>
                    <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                  <div className="relative overflow-hidden">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                    <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                  <div className="relative overflow-hidden">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                    <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="relative w-1/3 overflow-hidden">
                      <div className="h-6 animate-pulse rounded bg-gray-200"></div>
                      <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                    </div>
                    <div className="relative w-20 overflow-hidden">
                      <div className="h-8 animate-pulse rounded bg-gray-200"></div>
                      <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <AnimatedPaginationSkeleton></AnimatedPaginationSkeleton>

        <style jsx global>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .skeleton-shimmer {
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </div>
    </div>
  );
}

export function AnimatedPaginationSkeleton() {
  return (
    <main className="mx-auto flex-1 px-4 py-8">
      <div
        role="status"
        className="flex flex w-full animate-pulse justify-center gap-2"
      >
        <h3 className="mb-4 h-3 w-8 rounded-full bg-gray-200"></h3>
        <h3 className="mb-4 h-3 w-8 rounded-full bg-gray-200"></h3>
        <h3 className="mb-4 h-3 w-8 rounded-full bg-gray-200"></h3>
        <h3 className="mb-4 h-3 w-8 rounded-full bg-gray-200"></h3>
      </div>
    </main>
  );
}

export function AnimatedCollectionSkeleton() {
  return (
    <div
      className="relative w-full rounded-md overflow-hidden bg-gray-200"
      style={{
        minWidth:
          "calc(33vw, (min-width: 1024px)), calc(50vw, (min-width: 768px)), 100vw",
        minHeight: "45vh",
      }}
    >
      <div className="h-full w-full animate-pulse bg-gray-200"></div>
      <div className="absolute inset-0 m-4 flex animate-pulse flex-col items-center justify-center text-center">
        <div className="mb-4 h-6 w-3/4 animate-pulse rounded bg-gray-300"></div>
        <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-300"></div>
        <div className="h-10 w-32 animate-pulse rounded bg-gray-300"></div>
      </div>
    </div>
  );
}

export function AnimatedCollectionsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <AnimatedCollectionSkeleton />
      <AnimatedCollectionSkeleton />
      <AnimatedCollectionSkeleton />
    </div>
  );
}

export function AnimatedProductListingSkeleton() {
  return (
    <section aria-label="Loading collection heading">
      <div className="space-y-6 px-2 py-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-6 rounded-lg py-14 md:py-6">
              <div className="relative overflow-hidden">
                <div className="h-48 animate-pulse rounded bg-gray-200"></div>{" "}
                <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
              </div>
              <div className="relative overflow-hidden">
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>{" "}
                <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
              </div>
              <div className="relative overflow-hidden">
                <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>{" "}
                <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="relative w-1/3 overflow-hidden">
                  <div className="h-8 animate-pulse rounded bg-gray-200"></div>{" "}
                  <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                </div>
                <div className="relative w-24 overflow-hidden">
                  <div className="h-10 animate-pulse rounded bg-gray-200"></div>{" "}
                  <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnimatedProductDetailsSkeleton() {
  return (
    <>
      <section
        aria-label="Product details skeleton"
        className="container mx-auto pt-2"
      >
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left Sidebar - Thumbnail Images */}
          <div className="flex gap-4 w-full">
            <div className="hidden md:flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 md:h-full">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-full w-20 rounded-md bg-gray-200 animate-pulse"
                ></div>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1">
              <div className="h-96 w-full rounded-md bg-gray-200 animate-pulse"></div>
              {/* Left and Right Arrows */}
              <div className="absolute top-1/2 left-2 h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="absolute top-1/2 right-2 h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
            </div>
          </div>
          {/* Product Details */}
          <div className="flex flex-col justify-between w-full gap-4">
            <div className="flex-1 space-y-4">
              {/* Collection Name */}
              <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse"></div>
              {/* Product Title */}
              <div className="h-8 w-3/4 rounded bg-gray-200 animate-pulse"></div>
              {/* Price */}
              <div className="h-6 w-1/3 rounded bg-gray-200 animate-pulse"></div>
              {/* Description */}
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-full rounded bg-gray-200 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Size Options */}
              <div className="flex gap-4 w-full">
                <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse"></div>
                <div className="h-10 w-full rounded-md bg-gray-200 animate-pulse"></div>
              </div>
              {/* Add to Cart Button */}
              <div className="h-12 w-full rounded-md bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
