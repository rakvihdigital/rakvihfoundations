import { getPrograms } from "@/lib/programs";
import ProgramsFilterClient from "./ProgramsFilterClient";

export default async function ProgramsFilter() {
  const programs = await getPrograms();

  return <ProgramsFilterClient programs={programs} />;
}