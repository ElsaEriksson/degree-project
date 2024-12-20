"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productVariants = void 0;
const sizes = ["S/M", "M/L"];
const placeholderData = [];
let variantIdCounter = 1;
for (let productId = 1; productId <= 30; productId++) {
    sizes.forEach((size) => {
        const isOutOfStock = Math.random() < 0.1;
        placeholderData.push({
            variant_id: variantIdCounter++,
            product_id: productId,
            size,
            stock_quantity: isOutOfStock ? 0 : Math.floor(Math.random() * 100) + 1,
        });
    });
}
exports.productVariants = placeholderData;
console.log(placeholderData);
