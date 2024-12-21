export default async function fetchCartFromDatabase(userId: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
    return res;
  } catch (error) {
    console.error("Database Error:", error);
  }
}
