import MemberForm from "../../../components/MemberForm";

export default function NewMemberPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Add New Member</h1>
      <MemberForm />
    </div>
  );
}
