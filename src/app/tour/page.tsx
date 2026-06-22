import { redirect } from "next/navigation";

// The tour is now the home experience at `/`. Keep the old /tour URL working by
// sending it home.
export default function TourPage() {
  redirect("/");
}
