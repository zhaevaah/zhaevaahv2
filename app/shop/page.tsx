import { redirect } from "next/navigation";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = params?.category;

  if (category) {
    const catStr = String(category);
    // If the category belongs to men's collection, redirect to /men, otherwise /women
    if (catStr.toLowerCase().includes("men")) {
      redirect(`/men?category=${encodeURIComponent(catStr)}`);
    } else {
      redirect(`/women?category=${encodeURIComponent(catStr)}`);
    }
  }

  // Default redirect to women's collection
  redirect("/women");
}
