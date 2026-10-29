import { redirect } from "next/navigation";

// The medical fundraising campaign has concluded.
// All payment and checkout flows redirect back to the home memorial page.
export default function CheckoutSuccessPage() {
  redirect("/");
}
