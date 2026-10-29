import { redirect } from "next/navigation";

// The previous shop and cart were removed; all routes redirect back home.
export default function CartPage() {
  redirect("/");
}
