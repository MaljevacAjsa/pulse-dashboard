import { Suspense } from "react";
import CustomerProfile from "./CustomerProfile";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function CustomerProfileContent({ params }: PageProps) {
  const { id } = await params;

  return <CustomerProfile id={id} />;
}

export default function CustomerProfilePage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8F8FC] p-8">
          <p className="text-gray-500">Loading customer profile...</p>
        </main>
      }
    >
      <CustomerProfileContent params={props.params} />
    </Suspense>
  );
}
