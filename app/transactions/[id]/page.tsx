import { Suspense } from "react";
import TransactionDetails from "./TransactionDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function TransactionDetailsContent({ params }: PageProps) {
  const { id } = await params;

  return <TransactionDetails id={id} />;
}

export default function TransactionDetailsPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F6F5F8] p-8">
          <p className="text-gray-500">Loading transaction details...</p>
        </main>
      }
    >
      <TransactionDetailsContent params={props.params} />
    </Suspense>
  );
}
