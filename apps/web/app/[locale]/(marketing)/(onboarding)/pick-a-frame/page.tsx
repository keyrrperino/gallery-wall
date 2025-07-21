import Section from "@marketing/what-is-your-pledge/components/Section";

export default async function PickAFramePage() {
  return <Section onContinue={function (): void {
    throw new Error("Function not implemented.");
  } } onPledgeChange={function (): void {
    throw new Error("Function not implemented.");
  } } selected={null} />
}
