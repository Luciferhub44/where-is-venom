import { redirect } from "next/navigation";

// The merch shop & cart were removed — cup sponsorships and donations now
// check out directly, with no shipping step. This route just sends anyone
// who still has the old /cart link bookmarked back home.
export default function CartPage() {
  redirect("/");
}
