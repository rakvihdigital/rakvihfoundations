import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProgramDetails({
  params,
}: Props) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/programs/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    notFound();
  }

  const program = await res.json();

  return (
    <main className="max-w-5xl mx-auto py-10 px-6">

      <Image
        src={program.image}
        alt={program.title}
        width={900}
        height={400}
        className="rounded-2xl w-full h-[320px] object-cover shadow-md"
      />

      <h1 className="text-3xl font-bold mt-6 text-[#6B7328]">
        {program.title}
      </h1>

      <p className="mt-4 text-sm text-gray-600 leading-relaxed">
        {program.description}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 text-sm">

        <div>
          <span className="text-xs text-gray-500">Category</span>
          <p className="font-medium text-[#6B7328]">{program.category}</p>
        </div>

        <div>
          <span className="text-xs text-gray-500">Duration</span>
          <p className="font-medium text-[#6B7328]">{program.duration}</p>
        </div>

        <div>
          <span className="text-xs text-gray-500">Students</span>
          <p className="font-medium text-[#6B7328]">{program.students}</p>
        </div>

        <div>
          <span className="text-xs text-gray-500">Price</span>
          <p className="text-xl font-bold text-[#6B7328]">₹{program.price}</p>
        </div>

      </div>

    </main>
  );
}